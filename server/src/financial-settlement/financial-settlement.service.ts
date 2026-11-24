import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { IndentsAccess } from '../indents/indents.access.js';
import {
  CreateCommissionReceiptDto,
  CreateDebitNoteDto,
  DebitNoteLineDto,
  QuerySettlementDto,
  UpdateCommissionReceiptDto,
  UpdateDebitNoteDto,
} from './dto.js';

const DEBIT_BASE_NO = 6022600000;
const RECEIPT_BASE_NO = 7022600000;

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const money = (n: number) => new Prisma.Decimal(round2(n));

const clean = (val?: string) => {
  if (val === undefined) return undefined;
  const trimmed = val.trim();
  return trimmed.length ? trimmed : null;
};

@Injectable()
export class FinancialSettlementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: IndentsAccess,
  ) {}

  private formatDebitNote(row: any) {
    const received = round2(
      (row.receiptLines ?? []).reduce(
        (s: number, l: any) => s + Number(l.paidAmount || 0),
        0,
      ),
    );
    const total = Number(row.totalCommissionAmount || 0);
    const balance = round2(total - received);

    return {
      id: row.id,
      no: row.no,
      date: row.debitNoteDate,
      debitNoteDate: row.debitNoteDate,
      shipmentNo: row.shipmentNo,
      shipDate: row.shipDate ?? '',
      invNo: row.invNo ?? '',
      invDate: row.invDate ?? '',
      lcNo: row.lcNo ?? '',
      lcDate: row.lcDate ?? '',
      supplier: row.supplier,
      customer: row.customer,
      remarks: row.remarks ?? '',
      total,
      received,
      balance,
      status:
        received <= 0 ? 'Pending' : received >= total ? 'Settled' : 'Partial',
      createdBy: row.createdBy,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      lines: (row.lines ?? []).map((l: any) => ({
        id: l.id,
        productId: l.productId ?? '',
        product: l.product,
        description: l.description ?? '',
        detail: l.detail ?? '',
        shipQty: String(l.shipQty),
        unit: l.unit,
        scRate: String(l.scRate),
        indRate: String(l.indRate),
        commPct: String(l.commPct),
        otherAmt: String(l.otherAmt ?? 0),
        diffRate: Number(l.diffRate),
        opAmt: Number(l.opAmt),
        commAmt: Number(l.commAmt),
        totalComm: Number(l.totalComm),
      })),
    };
  }

  private formatReceipt(row: any) {
    const lines = (row.lines ?? []).map((l: any) => ({
      id: l.id,
      debitNoteNo: l.debitNoteNo,
      amount: Number(l.paidAmount).toFixed(2),
      paidAmount: Number(l.paidAmount),
    }));
    const total = round2(
      lines.reduce((s: number, l: any) => s + l.paidAmount, 0),
    );

    return {
      id: row.id,
      no: row.no,
      date: row.receiptDate,
      receiptDate: row.receiptDate,
      supplier: row.supplier,
      refNo: row.refNo ?? '',
      remarks: row.remarks ?? '',
      total,
      createdBy: row.createdBy,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      lines,
    };
  }

  private calcLine(l: DebitNoteLineDto) {
    const qty = Number(l.shipQty);
    const scRate = Number(l.scRate);
    const indRate = Number(l.indRate);
    const commPct = Number(l.commPct);
    const otherAmt = Number(l.otherAmt ?? 0);

    const amount = round2(qty * scRate);
    const diff = round2(scRate - indRate);
    const opAmt = round2(diff * qty);
    const commAmt = round2((amount * commPct) / 100);
    const totalComm = round2(commAmt + opAmt + otherAmt);

    return {
      productId: clean(l.productId) ?? null,
      product: l.product.trim(),
      description: clean(l.description) ?? null,
      detail: clean(l.detail) ?? null,
      shipQty: new Prisma.Decimal(qty),
      unit: l.unit.trim(),
      scRate: new Prisma.Decimal(scRate),
      indRate: new Prisma.Decimal(indRate),
      diffRate: money(diff),
      opAmt: money(opAmt),
      commPct: new Prisma.Decimal(commPct),
      commAmt: money(commAmt),
      otherAmt: money(otherAmt),
      totalComm: money(totalComm),
      totalCommNum: totalComm,
    };
  }

  private async generateDebitNo(customNo?: string): Promise<string> {
    if (customNo?.trim()) {
      const no = customNo.trim();
      const exists = await this.prisma.debitNote.findUnique({ where: { no } });
      if (exists) {
        throw new ConflictException(`Debit note '${no}' already exists.`);
      }
      return no;
    }

    const latest = await this.prisma.debitNote.findFirst({
      where: { no: { startsWith: '60226' } },
      orderBy: { no: 'desc' },
      select: { no: true },
    });
    const lastNum = latest
      ? parseInt(latest.no, 10) || DEBIT_BASE_NO
      : DEBIT_BASE_NO;
    return String(Math.max(lastNum, DEBIT_BASE_NO) + 1);
  }

  private async generateReceiptNo(customNo?: string): Promise<string> {
    if (customNo?.trim()) {
      const no = customNo.trim();
      const exists = await this.prisma.commissionReceipt.findUnique({
        where: { no },
      });
      if (exists) {
        throw new ConflictException(
          `Commission receipt '${no}' already exists.`,
        );
      }
      return no;
    }

    const latest = await this.prisma.commissionReceipt.findFirst({
      where: { no: { startsWith: '70226' } },
      orderBy: { no: 'desc' },
      select: { no: true },
    });
    const lastNum = latest
      ? parseInt(latest.no, 10) || RECEIPT_BASE_NO
      : RECEIPT_BASE_NO;
    return String(Math.max(lastNum, RECEIPT_BASE_NO) + 1);
  }

  async eligibleShipments(user: any) {
    await this.access.assertScreenPermission(user, 'Debit Note', 'view');
    const ids = await this.access.resolveScopeUserIds(user);
    const usedNos = (
      await this.prisma.debitNote.findMany({ select: { shipmentNo: true } })
    ).map((d) => d.shipmentNo);

    return this.prisma.tradeShipment.findMany({
      where: {
        readyForDebitNote: true,
        ...(usedNos.length ? { no: { notIn: usedNos } } : {}),
        ...(ids ? { createdBy: { in: ids } } : {}),
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listDebitNotes(user: any, q: QuerySettlementDto) {
    await this.access.assertScreenPermission(user, 'Debit Note', 'view');
    const ids = await this.access.resolveScopeUserIds(user);
    const search = q.q?.trim();

    const rows = await this.prisma.debitNote.findMany({
      where: {
        ...(ids ? { createdBy: { in: ids } } : {}),
        ...(search
          ? {
              OR: [
                { no: { contains: search, mode: 'insensitive' } },
                { shipmentNo: { contains: search, mode: 'insensitive' } },
                { supplier: { contains: search, mode: 'insensitive' } },
                { customer: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: { lines: true, receiptLines: true },
      orderBy: { createdAt: 'desc' },
    });

    return rows
      .map((r) => this.formatDebitNote(r))
      .filter(
        (r) => !q.status || r.status.toLowerCase() === q.status.toLowerCase(),
      );
  }

  async getDebitNote(user: any, idOrNo: string) {
    await this.access.assertScreenPermission(user, 'Debit Note', 'view');
    const row = await this.prisma.debitNote.findFirst({
      where: { OR: [{ no: idOrNo }, { id: idOrNo }] },
      include: { lines: true, receiptLines: true },
    });
    if (!row) throw new NotFoundException('Debit note not found.');
    const ids = await this.access.resolveScopeUserIds(user);
    if (ids && !ids.includes(row.createdBy ?? '')) {
      throw new ForbiddenException('Record outside your scope.');
    }
    return this.formatDebitNote(row);
  }

  async createDebitNote(user: any, dto: CreateDebitNoteDto) {
    await this.access.assertScreenPermission(user, 'Debit Note', 'create');

    const shipmentNo = dto.shipmentNo.trim();
    const existingForShipment = await this.prisma.debitNote.findUnique({
      where: { shipmentNo },
    });
    if (existingForShipment) {
      throw new ConflictException(
        `Shipment '${shipmentNo}' already has debit note '${existingForShipment.no}'.`,
      );
    }

    if (dto.shipDate && dto.date < dto.shipDate) {
      throw new BadRequestException(
        'Debit note date cannot be before the shipment date.',
      );
    }

    const no = await this.generateDebitNo(dto.no);
    const computedLines = dto.lines.map((l) => this.calcLine(l));
    const totalComm = round2(
      computedLines.reduce((s, l) => s + l.totalCommNum, 0),
    );

    const created = await this.prisma.debitNote.create({
      data: {
        no,
        debitNoteDate: dto.date.trim(),
        shipmentNo,
        shipDate: clean(dto.shipDate) ?? null,
        invNo: clean(dto.invNo) ?? null,
        invDate: clean(dto.invDate) ?? null,
        lcNo: clean(dto.lcNo) ?? null,
        lcDate: clean(dto.lcDate) ?? null,
        supplier: dto.supplier.trim(),
        customer: dto.customer.trim(),
        remarks: clean(dto.remarks) ?? null,
        totalCommissionAmount: money(totalComm),
        createdBy: user.id,
        lines: {
          create: computedLines.map((l) => ({
            productId: l.productId,
            product: l.product,
            description: l.description,
            detail: l.detail,
            shipQty: l.shipQty,
            unit: l.unit,
            scRate: l.scRate,
            indRate: l.indRate,
            diffRate: l.diffRate,
            opAmt: l.opAmt,
            commPct: l.commPct,
            commAmt: l.commAmt,
            otherAmt: l.otherAmt,
            totalComm: l.totalComm,
          })),
        },
      },
      include: { lines: true, receiptLines: true },
    });

    return this.formatDebitNote(created);
  }

  async updateDebitNote(user: any, idOrNo: string, dto: UpdateDebitNoteDto) {
    await this.access.assertScreenPermission(user, 'Debit Note', 'edit');

    const existing = await this.prisma.debitNote.findFirst({
      where: { OR: [{ no: idOrNo }, { id: idOrNo }] },
      include: { lines: true, receiptLines: true },
    });
    if (!existing) throw new NotFoundException('Debit note not found.');

    const ids = await this.access.resolveScopeUserIds(user);
    if (ids && !ids.includes(existing.createdBy ?? '')) {
      throw new ForbiddenException('Record outside your scope.');
    }

    const nextDate = dto.date?.trim() ?? existing.debitNoteDate;
    const nextShipDate =
      dto.shipDate !== undefined ? clean(dto.shipDate) : existing.shipDate;
    if (nextShipDate && nextDate < nextShipDate) {
      throw new BadRequestException(
        'Debit note date cannot be before the shipment date.',
      );
    }

    const received = round2(
      existing.receiptLines.reduce((s, l) => s + Number(l.paidAmount || 0), 0),
    );

    let computedLines: ReturnType<typeof this.calcLine>[] | undefined;
    let totalComm = Number(existing.totalCommissionAmount);
    if (dto.lines) {
      computedLines = dto.lines.map((l) => this.calcLine(l));
      totalComm = round2(computedLines.reduce((s, l) => s + l.totalCommNum, 0));
      if (received > 0 && totalComm + 0.001 < received) {
        throw new BadRequestException(
          `Total commission (${totalComm}) cannot be below the ${received} already received.`,
        );
      }
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      if (computedLines) {
        await tx.debitNoteLine.deleteMany({
          where: { debitNoteNo: existing.no },
        });
      }
      return tx.debitNote.update({
        where: { id: existing.id },
        data: {
          ...(dto.date !== undefined
            ? { debitNoteDate: dto.date.trim() }
            : {}),
          ...(dto.shipDate !== undefined
            ? { shipDate: clean(dto.shipDate) }
            : {}),
          ...(dto.invNo !== undefined ? { invNo: clean(dto.invNo) } : {}),
          ...(dto.invDate !== undefined ? { invDate: clean(dto.invDate) } : {}),
          ...(dto.lcNo !== undefined ? { lcNo: clean(dto.lcNo) } : {}),
          ...(dto.lcDate !== undefined ? { lcDate: clean(dto.lcDate) } : {}),
          ...(dto.supplier !== undefined
            ? { supplier: dto.supplier.trim() }
            : {}),
          ...(dto.customer !== undefined
            ? { customer: dto.customer.trim() }
            : {}),
          ...(dto.remarks !== undefined ? { remarks: clean(dto.remarks) } : {}),
          ...(computedLines
            ? {
                totalCommissionAmount: money(totalComm),
                lines: {
                  create: computedLines.map((l) => ({
                    productId: l.productId,
                    product: l.product,
                    description: l.description,
                    detail: l.detail,
                    shipQty: l.shipQty,
                    unit: l.unit,
                    scRate: l.scRate,
                    indRate: l.indRate,
                    diffRate: l.diffRate,
                    opAmt: l.opAmt,
                    commPct: l.commPct,
                    commAmt: l.commAmt,
                    otherAmt: l.otherAmt,
                    totalComm: l.totalComm,
                  })),
                },
              }
            : {}),
        },
        include: { lines: true, receiptLines: true },
      });
    });

    return this.formatDebitNote(updated);
  }

  async deleteDebitNote(user: any, idOrNo: string) {
    await this.access.assertScreenPermission(user, 'Debit Note', 'delete');

    const existing = await this.prisma.debitNote.findFirst({
      where: { OR: [{ no: idOrNo }, { id: idOrNo }] },
      include: { receiptLines: true },
    });
    if (!existing) throw new NotFoundException('Debit note not found.');

    const ids = await this.access.resolveScopeUserIds(user);
    if (ids && !ids.includes(existing.createdBy ?? '')) {
      throw new ForbiddenException('Record outside your scope.');
    }

    if (existing.receiptLines.length > 0) {
      throw new BadRequestException(
        `Debit note '${existing.no}' has commission receipts allocated. Delete the receipt first.`,
      );
    }

    await this.prisma.debitNote.delete({ where: { id: existing.id } });
    return { ok: true, no: existing.no };
  }

  async listReceipts(user: any, q: QuerySettlementDto) {
    await this.access.assertScreenPermission(
      user,
      'Commission Receive',
      'view',
    );
    const ids = await this.access.resolveScopeUserIds(user);
    const search = q.q?.trim();

    const rows = await this.prisma.commissionReceipt.findMany({
      where: {
        ...(ids ? { createdBy: { in: ids } } : {}),
        ...(search
          ? {
              OR: [
                { no: { contains: search, mode: 'insensitive' } },
                { supplier: { contains: search, mode: 'insensitive' } },
                { refNo: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: { lines: true },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((r) => this.formatReceipt(r));
  }

  async getReceipt(user: any, idOrNo: string) {
    await this.access.assertScreenPermission(
      user,
      'Commission Receive',
      'view',
    );
    const row = await this.prisma.commissionReceipt.findFirst({
      where: { OR: [{ no: idOrNo }, { id: idOrNo }] },
      include: { lines: true },
    });
    if (!row) throw new NotFoundException('Commission receipt not found.');
    const ids = await this.access.resolveScopeUserIds(user);
    if (ids && !ids.includes(row.createdBy ?? '')) {
      throw new ForbiddenException('Record outside your scope.');
    }
    return this.formatReceipt(row);
  }

  private async validateReceiptAllocations(
    receiptDate: string,
    supplier: string,
    lines: { debitNoteNo: string; amount: number }[],
    excludeReceiptNo?: string,
  ) {
    const seen = new Set<string>();
    for (const l of lines) {
      const dnNo = l.debitNoteNo.trim();
      if (seen.has(dnNo)) {
        throw new BadRequestException(
          `Duplicate debit note '${dnNo}' in the same receipt.`,
        );
      }
      seen.add(dnNo);
    }

    const dnNos = Array.from(seen);
    const notes = await this.prisma.debitNote.findMany({
      where: { no: { in: dnNos } },
      include: { receiptLines: true },
    });
    const byNo = new Map(notes.map((n) => [n.no, n]));

    for (const l of lines) {
      const dnNo = l.debitNoteNo.trim();
      const note = byNo.get(dnNo);
      if (!note) {
        throw new BadRequestException(`Debit note '${dnNo}' not found.`);
      }
      if (note.supplier.trim().toLowerCase() !== supplier.trim().toLowerCase()) {
        throw new BadRequestException(
          `Debit note '${dnNo}' does not belong to supplier '${supplier}'.`,
        );
      }
      if (receiptDate < note.debitNoteDate) {
        throw new BadRequestException(
          `Receipt date cannot be before debit note '${dnNo}' date (${note.debitNoteDate}).`,
        );
      }
      const alreadyPaid = round2(
        note.receiptLines
          .filter((rl) => rl.receiptNo !== excludeReceiptNo)
          .reduce((s, rl) => s + Number(rl.paidAmount || 0), 0),
      );
      const remaining = round2(
        Number(note.totalCommissionAmount || 0) - alreadyPaid,
      );
      if (Number(l.amount) > remaining + 0.001) {
        throw new BadRequestException(
          `Receive amount (${l.amount}) exceeds remaining balance (${remaining}) for debit note '${dnNo}'.`,
        );
      }
    }
  }

  async createReceipt(user: any, dto: CreateCommissionReceiptDto) {
    await this.access.assertScreenPermission(
      user,
      'Commission Receive',
      'create',
    );

    const receiptDate = dto.date.trim();
    const supplier = dto.supplier.trim();
    await this.validateReceiptAllocations(receiptDate, supplier, dto.lines);

    const no = await this.generateReceiptNo(dto.no);
    const created = await this.prisma.commissionReceipt.create({
      data: {
        no,
        receiptDate,
        supplier,
        refNo: clean(dto.refNo) ?? null,
        remarks: clean(dto.remarks) ?? null,
        createdBy: user.id,
        lines: {
          create: dto.lines.map((l) => ({
            debitNoteNo: l.debitNoteNo.trim(),
            paidAmount: money(Number(l.amount)),
          })),
        },
      },
      include: { lines: true },
    });

    return this.formatReceipt(created);
  }

  async updateReceipt(
    user: any,
    idOrNo: string,
    dto: UpdateCommissionReceiptDto,
  ) {
    await this.access.assertScreenPermission(
      user,
      'Commission Receive',
      'edit',
    );

    const existing = await this.prisma.commissionReceipt.findFirst({
      where: { OR: [{ no: idOrNo }, { id: idOrNo }] },
      include: { lines: true },
    });
    if (!existing) throw new NotFoundException('Commission receipt not found.');

    const ids = await this.access.resolveScopeUserIds(user);
    if (ids && !ids.includes(existing.createdBy ?? '')) {
      throw new ForbiddenException('Record outside your scope.');
    }

    const nextDate = dto.date?.trim() ?? existing.receiptDate;
    const nextSupplier = dto.supplier?.trim() ?? existing.supplier;
    const nextLines =
      dto.lines ??
      existing.lines.map((l) => ({
        debitNoteNo: l.debitNoteNo,
        amount: Number(l.paidAmount),
      }));

    await this.validateReceiptAllocations(
      nextDate,
      nextSupplier,
      nextLines,
      existing.no,
    );

    const updated = await this.prisma.$transaction(async (tx) => {
      if (dto.lines) {
        await tx.commissionReceiptLine.deleteMany({
          where: { receiptNo: existing.no },
        });
      }
      return tx.commissionReceipt.update({
        where: { id: existing.id },
        data: {
          ...(dto.date !== undefined ? { receiptDate: dto.date.trim() } : {}),
          ...(dto.supplier !== undefined
            ? { supplier: dto.supplier.trim() }
            : {}),
          ...(dto.refNo !== undefined ? { refNo: clean(dto.refNo) } : {}),
          ...(dto.remarks !== undefined ? { remarks: clean(dto.remarks) } : {}),
          ...(dto.lines
            ? {
                lines: {
                  create: dto.lines.map((l) => ({
                    debitNoteNo: l.debitNoteNo.trim(),
                    paidAmount: money(Number(l.amount)),
                  })),
                },
              }
            : {}),
        },
        include: { lines: true },
      });
    });

    return this.formatReceipt(updated);
  }

  async deleteReceipt(user: any, idOrNo: string) {
    await this.access.assertScreenPermission(
      user,
      'Commission Receive',
      'delete',
    );

    const existing = await this.prisma.commissionReceipt.findFirst({
      where: { OR: [{ no: idOrNo }, { id: idOrNo }] },
    });
    if (!existing) throw new NotFoundException('Commission receipt not found.');

    const ids = await this.access.resolveScopeUserIds(user);
    if (ids && !ids.includes(existing.createdBy ?? '')) {
      throw new ForbiddenException('Record outside your scope.');
    }

    await this.prisma.commissionReceipt.delete({ where: { id: existing.id } });
    return { ok: true, no: existing.no };
  }
}
