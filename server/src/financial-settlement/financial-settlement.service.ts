import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import {
  CreateCommissionReceiptDto,
  CreateDebitNoteDto,
  QuerySettlementDto,
} from './dto.js';
import { IndentsAccess } from '../indents/indents.access.js';

const money = (n: number) =>
  new Prisma.Decimal(Math.round((n + Number.EPSILON) * 100) / 100);
const rounded = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
@Injectable()
export class FinancialSettlementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: IndentsAccess,
  ) {}
  private async assert(
    user: any,
    screen: string,
    action: 'view' | 'create' | 'edit' | 'delete',
  ) {
    await this.access.assertScreenPermission(user, screen, action);
  }
  private scope(user: any): Promise<string[] | null> {
    return this.access.resolveScopeUserIds(user);
  }
  private async nextNo(
    tx: Prisma.TransactionClient,
    model: 'debitNote' | 'commissionReceipt',
    prefix: string,
  ) {
    const year = String(new Date().getFullYear()).slice(-2);
    const stem = `${prefix}02${year}`;
    const counter = await (tx as any).financialDocumentCounter.upsert({
      where: { key: stem },
      create: { key: stem, value: 1 },
      update: { value: { increment: 1 } },
    });
    return `${stem}${String(counter.value).padStart(5, '0')}`;
  }
  async eligibleShipments(user: any) {
    await this.assert(user, 'Debit Note', 'view');
    const ids = await this.scope(user);
    return this.prisma.tradeShipment.findMany({
      where: {
        readyForDebitNote: true,
        debitNotes: { none: {} },
        ...(ids ? { createdBy: { in: ids } } : {}),
      },
      include: { items: true },
      orderBy: { shipmentDate: 'desc' },
    });
  }
  async listDebitNotes(user: any, q: QuerySettlementDto) {
    await this.assert(user, 'Debit Note', 'view');
    const ids = await this.scope(user);
    const search = q.q?.trim();
    const rows = await this.prisma.debitNote.findMany({
      where: {
        ...(ids ? { createdBy: { in: ids } } : {}),
        ...(search
          ? {
              OR: [
                { no: { contains: search, mode: 'insensitive' } },
                { shipmentNo: { contains: search, mode: 'insensitive' } },
                {
                  supplier: { name: { contains: search, mode: 'insensitive' } },
                },
                {
                  customer: { name: { contains: search, mode: 'insensitive' } },
                },
              ],
            }
          : {}),
      },
      include: {
        supplier: true,
        customer: true,
        shipment: true,
        lines: true,
        receiptLines: true,
      },
      orderBy: { debitNoteDate: 'desc' },
    });
    const data = rows
      .map((r) => this.formatDebit(r))
      .filter(
        (r) => !q.status || r.status.toLowerCase() === q.status.toLowerCase(),
      );
    return {
      stats: {
        total: data.length,
        outstanding: rounded(data.reduce((s, r) => s + r.balance, 0)),
        received: rounded(data.reduce((s, r) => s + r.received, 0)),
      },
      items: data,
    };
  }
  private formatDebit(r: any) {
    const received = rounded(
      r.receiptLines.reduce((s: any, l: any) => s + Number(l.paidAmount), 0),
    );
    const total = Number(r.totalCommissionAmount);
    return {
      ...r,
      received,
      balance: rounded(total - received),
      status:
        received <= 0 ? 'Pending' : received >= total ? 'Settled' : 'Partial',
      lines: r.lines.map((l: any) => ({
        ...l,
        shipQty: Number(l.shipQty),
        scRate: Number(l.scRate),
        indRate: Number(l.indRate),
        diffRate: Number(l.diffRate),
        opAmt: Number(l.opAmt),
        commPct: Number(l.commPct),
        commAmt: Number(l.commAmt),
        otherAmt: Number(l.otherAmt),
        totalComm: Number(l.totalComm),
      })),
    };
  }
  async getDebitNote(user: any, id: string) {
    await this.assert(user, 'Debit Note', 'view');
    const r = await this.prisma.debitNote.findUnique({
      where: { id },
      include: {
        supplier: true,
        customer: true,
        shipment: true,
        lines: true,
        receiptLines: { include: { receipt: true } },
      },
    });
    if (!r) throw new NotFoundException('Debit note not found.');
    const ids = await this.scope(user);
    if (ids && !ids.includes(r.createdBy ?? ''))
      throw new ForbiddenException('Record outside your scope.');
    return this.formatDebit(r);
  }
  async createDebitNote(user: any, dto: CreateDebitNoteDto) {
    await this.assert(user, 'Debit Note', 'create');
    return this.prisma.$transaction(
      async (tx) => {
        const shipment = await tx.tradeShipment.findUnique({
          where: { no: dto.shipmentNo },
          include: { items: true },
        });
        if (!shipment) throw new NotFoundException('Shipment not found.');
        const scopeIds = await this.scope(user);
        if (scopeIds && !scopeIds.includes(shipment.createdBy ?? ''))
          throw new ForbiddenException('Shipment is outside your scope.');
        if (!shipment.readyForDebitNote)
          throw new BadRequestException(
            'Shipment is not ready for debit note.',
          );
        if (
          await tx.debitNote.findUnique({
            where: { shipmentNo: dto.shipmentNo },
          })
        )
          throw new ConflictException(
            'A debit note already exists for this shipment.',
          );
        const [supplier, customer] = await Promise.all([
          tx.masterAccount.findFirst({
            where: { id: dto.supplierId, type: 'Supplier' },
          }),
          tx.masterAccount.findFirst({
            where: { id: dto.customerId, type: 'Customer' },
          }),
        ]);
        if (!supplier || !customer)
          throw new BadRequestException(
            'Select valid supplier and customer accounts.',
          );
        if (
          supplier.name.trim().toLowerCase() !==
            shipment.supplier.trim().toLowerCase() ||
          customer.name.trim().toLowerCase() !==
            shipment.customer.trim().toLowerCase()
        )
          throw new BadRequestException(
            'Supplier and customer must match the selected shipment.',
          );
        for (const line of dto.lines) {
          const shipmentItem = shipment.items.find((item) =>
            line.productId
              ? item.productId === line.productId
              : item.product.trim().toLowerCase() ===
                line.product.trim().toLowerCase(),
          );
          if (!shipmentItem) {
            throw new BadRequestException(
              `Product ${line.product} is not part of shipment ${shipment.no}.`,
            );
          }
          if (line.shipQty > Number(shipmentItem.shippedQty)) {
            throw new BadRequestException(
              `Quantity for ${line.product} exceeds the shipped quantity.`,
            );
          }
        }
        const lines = dto.lines.map((l) => {
          const diff = rounded(l.scRate - l.indRate),
            op = rounded(diff * l.shipQty),
            comm = rounded((l.shipQty * l.scRate * l.commPct) / 100),
            other = rounded(l.otherAmt || 0);
          return {
            productId: l.productId || null,
            product: l.product.trim(),
            description: l.description?.trim() || null,
            detail: l.detail?.trim() || null,
            shipQty: new Prisma.Decimal(l.shipQty),
            unit: l.unit.trim(),
            scRate: new Prisma.Decimal(l.scRate),
            indRate: new Prisma.Decimal(l.indRate),
            diffRate: new Prisma.Decimal(diff),
            opAmt: money(op),
            commPct: new Prisma.Decimal(l.commPct),
            commAmt: money(comm),
            otherAmt: money(other),
            totalComm: money(comm + op + other),
          };
        });
        const total = rounded(
          lines.reduce((s, l) => s + Number(l.totalComm), 0),
        );
        return tx.debitNote.create({
          data: {
            no: await this.nextNo(tx, 'debitNote', '6'),
            debitNoteDate: new Date(dto.debitNoteDate),
            shipmentNo: dto.shipmentNo,
            supplierId: supplier.id,
            customerId: customer.id,
            totalCommissionAmount: money(total),
            remarks: dto.remarks?.trim() || null,
            createdBy: user.id,
            lines: { create: lines },
          },
          include: {
            supplier: true,
            customer: true,
            shipment: true,
            lines: true,
            receiptLines: true,
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }
  async updateDebitNote(user: any, id: string, dto: CreateDebitNoteDto) {
    await this.assert(user, 'Debit Note', 'edit');
    return this.prisma.$transaction(
      async (tx) => {
        const existing = await tx.debitNote.findUnique({
          where: { id },
          include: { receiptLines: true },
        });
        if (!existing) throw new NotFoundException('Debit note not found.');
        const scopeIds = await this.scope(user);
        if (scopeIds && !scopeIds.includes(existing.createdBy ?? ''))
          throw new ForbiddenException('Record outside your scope.');
        if (dto.shipmentNo !== existing.shipmentNo)
          throw new BadRequestException(
            'The shipment linked to a debit note cannot be changed.',
          );

        const shipment = await tx.tradeShipment.findUnique({
          where: { no: existing.shipmentNo },
          include: { items: true },
        });
        if (!shipment) throw new NotFoundException('Shipment not found.');
        if (!shipment.readyForDebitNote)
          throw new BadRequestException(
            'Shipment is not ready for debit note.',
          );
        const [supplier, customer] = await Promise.all([
          tx.masterAccount.findFirst({
            where: { id: dto.supplierId, type: 'Supplier' },
          }),
          tx.masterAccount.findFirst({
            where: { id: dto.customerId, type: 'Customer' },
          }),
        ]);
        if (!supplier || !customer)
          throw new BadRequestException(
            'Select valid supplier and customer accounts.',
          );
        if (
          supplier.name.trim().toLowerCase() !==
            shipment.supplier.trim().toLowerCase() ||
          customer.name.trim().toLowerCase() !==
            shipment.customer.trim().toLowerCase()
        )
          throw new BadRequestException(
            'Supplier and customer must match the selected shipment.',
          );

        const lines = dto.lines.map((line) => {
          const shipmentItem = shipment.items.find((item) =>
            line.productId
              ? item.productId === line.productId
              : item.product.trim().toLowerCase() ===
                line.product.trim().toLowerCase(),
          );
          if (!shipmentItem)
            throw new BadRequestException(
              `Product ${line.product} is not part of shipment ${shipment.no}.`,
            );
          if (line.shipQty > Number(shipmentItem.shippedQty))
            throw new BadRequestException(
              `Quantity for ${line.product} exceeds the shipped quantity.`,
            );
          const diff = rounded(line.scRate - line.indRate);
          const op = rounded(diff * line.shipQty);
          const comm = rounded(
            (line.shipQty * line.scRate * line.commPct) / 100,
          );
          const other = rounded(line.otherAmt || 0);
          return {
            productId: line.productId || null,
            product: line.product.trim(),
            description: line.description?.trim() || null,
            detail: line.detail?.trim() || null,
            shipQty: new Prisma.Decimal(line.shipQty),
            unit: line.unit.trim(),
            scRate: new Prisma.Decimal(line.scRate),
            indRate: new Prisma.Decimal(line.indRate),
            diffRate: new Prisma.Decimal(diff),
            opAmt: money(op),
            commPct: new Prisma.Decimal(line.commPct),
            commAmt: money(comm),
            otherAmt: money(other),
            totalComm: money(comm + op + other),
          };
        });
        const total = rounded(
          lines.reduce((sum, line) => sum + Number(line.totalComm), 0),
        );
        const alreadyReceived = existing.receiptLines.reduce(
          (sum, line) => sum + Number(line.paidAmount),
          0,
        );
        if (total + 0.001 < alreadyReceived)
          throw new BadRequestException(
            'Total commission cannot be less than the amount already received.',
          );

        await tx.debitNoteLine.deleteMany({ where: { debitNoteId: id } });
        const updated = await tx.debitNote.update({
          where: { id },
          data: {
            debitNoteDate: new Date(dto.debitNoteDate),
            supplierId: supplier.id,
            customerId: customer.id,
            totalCommissionAmount: money(total),
            remarks: dto.remarks?.trim() || null,
            lines: { create: lines },
          },
          include: {
            supplier: true,
            customer: true,
            shipment: true,
            lines: true,
            receiptLines: true,
          },
        });
        return this.formatDebit(updated);
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }
  async deleteDebitNote(user: any, id: string) {
    await this.assert(user, 'Debit Note', 'delete');
    const row = await this.prisma.debitNote.findUnique({
      where: { id },
      include: { receiptLines: true },
    });
    if (!row) throw new NotFoundException('Debit note not found.');
    if (row.receiptLines.length)
      throw new ConflictException(
        'Debit note has receipt allocations and cannot be deleted.',
      );
    const ids = await this.scope(user);
    if (ids && !ids.includes(row.createdBy ?? ''))
      throw new ForbiddenException('Record outside your scope.');
    await this.prisma.debitNote.delete({ where: { id } });
    return { ok: true, id };
  }
  async listReceipts(user: any, q: QuerySettlementDto) {
    await this.assert(user, 'Commission Receive', 'view');
    const ids = await this.scope(user);
    const items = await this.prisma.commissionReceipt.findMany({
      where: {
        ...(ids ? { createdBy: { in: ids } } : {}),
        ...(q.q?.trim()
          ? {
              OR: [
                { no: { contains: q.q.trim(), mode: 'insensitive' } },
                { refNo: { contains: q.q.trim(), mode: 'insensitive' } },
                {
                  supplier: {
                    name: { contains: q.q.trim(), mode: 'insensitive' },
                  },
                },
              ],
            }
          : {}),
      },
      include: { supplier: true, lines: { include: { debitNote: true } } },
      orderBy: { receiptDate: 'desc' },
    });
    return {
      stats: {
        total: items.length,
        amount: rounded(
          items.reduce(
            (s, r) => s + r.lines.reduce((a, l) => a + Number(l.paidAmount), 0),
            0,
          ),
        ),
      },
      items,
    };
  }
  async getReceipt(user: any, id: string) {
    await this.assert(user, 'Commission Receive', 'view');
    const r = await this.prisma.commissionReceipt.findUnique({
      where: { id },
      include: { supplier: true, lines: { include: { debitNote: true } } },
    });
    if (!r) throw new NotFoundException('Commission receipt not found.');
    const ids = await this.scope(user);
    if (ids && !ids.includes(r.createdBy ?? ''))
      throw new ForbiddenException('Record outside your scope.');
    return r;
  }
  async createReceipt(user: any, dto: CreateCommissionReceiptDto) {
    await this.assert(user, 'Commission Receive', 'create');
    if (new Set(dto.lines.map((l) => l.debitNoteId)).size !== dto.lines.length)
      throw new BadRequestException(
        'Each debit note may appear once per receipt.',
      );
    return this.prisma.$transaction(
      async (tx) => {
        const supplier = await tx.masterAccount.findFirst({
          where: { id: dto.supplierId, type: 'Supplier' },
        });
        if (!supplier)
          throw new BadRequestException('Select a valid supplier.');
        const ids = dto.lines.map((l) => l.debitNoteId);
        const scopeIds = await this.scope(user);
        const notes = await tx.debitNote.findMany({
          where: {
            id: { in: ids },
            supplierId: supplier.id,
            ...(scopeIds ? { createdBy: { in: scopeIds } } : {}),
          },
          include: { receiptLines: true },
        });
        if (notes.length !== ids.length)
          throw new BadRequestException(
            'Debit notes must belong to the selected supplier.',
          );
        for (const l of dto.lines) {
          const n = notes.find((x) => x.id === l.debitNoteId)!;
          const paid = n.receiptLines.reduce(
            (s, x) => s + Number(x.paidAmount),
            0,
          );
          if (l.paidAmount > Number(n.totalCommissionAmount) - paid + 0.001)
            throw new BadRequestException(
              `Allocation exceeds the outstanding balance for debit note ${n.no}.`,
            );
        }
        return tx.commissionReceipt.create({
          data: {
            no: await this.nextNo(tx, 'commissionReceipt', '7'),
            receiptDate: new Date(dto.receiptDate),
            supplierId: supplier.id,
            refNo: dto.refNo?.trim() || null,
            remarks: dto.remarks?.trim() || null,
            createdBy: user.id,
            lines: {
              create: dto.lines.map((l) => ({
                debitNoteId: l.debitNoteId,
                paidAmount: money(l.paidAmount),
              })),
            },
          },
          include: { supplier: true, lines: { include: { debitNote: true } } },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }
  async updateReceipt(user: any, id: string, dto: CreateCommissionReceiptDto) {
    await this.assert(user, 'Commission Receive', 'edit');
    if (new Set(dto.lines.map((line) => line.debitNoteId)).size !== dto.lines.length)
      throw new BadRequestException(
        'Each debit note may appear once per receipt.',
      );
    return this.prisma.$transaction(
      async (tx) => {
        const existing = await tx.commissionReceipt.findUnique({
          where: { id },
          include: { lines: true },
        });
        if (!existing)
          throw new NotFoundException('Commission receipt not found.');
        const scopeIds = await this.scope(user);
        if (scopeIds && !scopeIds.includes(existing.createdBy ?? ''))
          throw new ForbiddenException('Record outside your scope.');
        if (dto.supplierId !== existing.supplierId)
          throw new BadRequestException(
            'The supplier linked to a commission receipt cannot be changed.',
          );

        const oldAmounts = new Map(
          existing.lines.map((line) => [line.debitNoteId, Number(line.paidAmount)]),
        );
        const requested = new Map(
          dto.lines.map((line) => [line.debitNoteId, line.paidAmount]),
        );
        const ids = dto.lines.map((line) => line.debitNoteId);
        const notes = await tx.debitNote.findMany({
          where: {
            id: { in: ids },
            supplierId: existing.supplierId,
            ...(scopeIds ? { createdBy: { in: scopeIds } } : {}),
          },
          include: { receiptLines: true },
        });
        const accessibleIds = new Set(notes.map((note) => note.id));

        // Existing allocations outside the caller's record scope may be retained,
        // but cannot be changed or removed through this receipt edit.
        for (const [noteId, amount] of oldAmounts) {
          if (accessibleIds.has(noteId)) continue;
          if (requested.get(noteId) !== amount)
            throw new ForbiddenException(
              'Allocations to debit notes outside your scope must remain unchanged.',
            );
        }
        for (const line of dto.lines) {
          const note = notes.find((candidate) => candidate.id === line.debitNoteId);
          if (!note) {
            if (oldAmounts.get(line.debitNoteId) === line.paidAmount) continue;
            throw new BadRequestException(
              'Debit notes must belong to the receipt supplier and your access scope.',
            );
          }
          if (new Date(dto.receiptDate) < note.debitNoteDate)
            throw new BadRequestException(
              `Receipt date cannot be before debit note ${note.no}.`,
            );
          const paidByOtherReceipts = note.receiptLines
            .filter((allocation) => allocation.receiptId !== id)
            .reduce((sum, allocation) => sum + Number(allocation.paidAmount), 0);
          const outstanding =
            Number(note.totalCommissionAmount) - paidByOtherReceipts;
          if (line.paidAmount > outstanding + 0.001)
            throw new BadRequestException(
              `Allocation exceeds the outstanding balance for debit note ${note.no}.`,
            );
        }
        if (dto.lines.length === 0)
          throw new BadRequestException(
            'A commission receipt needs at least one debit note allocation.',
          );

        await tx.commissionReceiptLine.deleteMany({ where: { receiptId: id } });
        return tx.commissionReceipt.update({
          where: { id },
          data: {
            receiptDate: new Date(dto.receiptDate),
            refNo: dto.refNo?.trim() || null,
            remarks: dto.remarks?.trim() || null,
            lines: {
              create: dto.lines.map((line) => ({
                debitNoteId: line.debitNoteId,
                paidAmount: money(line.paidAmount),
              })),
            },
          },
          include: { supplier: true, lines: { include: { debitNote: true } } },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }
  async deleteReceipt(user: any, id: string) {
    await this.assert(user, 'Commission Receive', 'delete');
    const r = await this.prisma.commissionReceipt.findUnique({ where: { id } });
    if (!r) throw new NotFoundException('Commission receipt not found.');
    const ids = await this.scope(user);
    if (ids && !ids.includes(r.createdBy ?? ''))
      throw new ForbiddenException('Record outside your scope.');
    await this.prisma.commissionReceipt.delete({ where: { id } });
    return { ok: true, id };
  }
}
