import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import {
  CreateShipmentDocDto,
  CreateShipmentDto,
  QueryShipmentDto,
  SendShipmentDocDto,
  ShipmentDocFileDto,
  ShipmentItemDto,
  UpdateShipmentDocDto,
  UpdateShipmentDto,
} from './dto.js';
import { ShipmentsAccess } from './shipments.access.js';

const SHIPMENT_BASE_NO = 5022600000;

const clean = (val?: string) => {
  if (val === undefined) return undefined;
  const trimmed = val.trim();
  return trimmed.length ? trimmed : null;
};

@Injectable()
export class ShipmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: ShipmentsAccess,
  ) {}

  private formatShipment(row: any) {
    const lines = (row.items ?? []).map((item: any) => {
      const shipQty = Number(item.shippedQty);
      const rate = Number(item.rate);
      const amount = Math.round(shipQty * rate * 100) / 100;
      return {
        id: item.id,
        productId: item.productId ?? '',
        product: item.product,
        description: item.description ?? '',
        qty: item.indentQty !== null && item.indentQty !== undefined ? String(item.indentQty) : String(shipQty),
        shipQty: String(item.shippedQty),
        shippedQty: shipQty,
        unit: item.unit,
        rate: String(item.rate),
        amount,
      };
    });

    const totalAmount =
      Math.round(
        lines.reduce((sum: number, l: any) => sum + l.amount, 0) * 100,
      ) / 100;

    return {
      id: row.id,
      no: row.no,
      date: row.shipmentDate,
      shipmentDate: row.shipmentDate,
      lotNo: row.lotNo ?? '',
      indentNo: row.indentNo,
      indentDate: row.indentDate ?? '',
      lcNo: row.lcNo ?? '',
      lcDate: row.lcDate ?? '',
      lcExpiry: row.lcExpiry ?? '',
      lcBank: row.lcBank ?? '',
      lcAccountNo: row.lcAccountNo ?? '',
      supplier: row.supplier,
      customer: row.customer,
      salesperson: row.salesperson ?? '',
      commercialPerson: row.commercialPerson ?? '',
      invoiceNo: row.invoiceNo ?? '',
      invoiceDate: row.invoiceDate ?? '',
      blNo: row.blNo ?? '',
      blDate: row.blDate ?? '',
      shipmentRemarks: row.shipmentRemarks ?? '',
      otherRemarks: row.otherRemarks ?? '',
      finalRemarks: row.finalRemarks ?? '',
      readyForDebitNote: Boolean(row.readyForDebitNote),
      totalAmount,
      createdBy: row.createdBy,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      lines,
    };
  }

  private formatDocument(row: any) {
    return {
      id: row.id,
      indentNo: row.indentNo,
      supplier: row.supplier,
      customer: row.customer,
      confNo: row.confNo ?? '',
      confDate: row.confDate ?? '',
      shipmentDate: row.shipmentDate ?? '',
      arrivalDate: row.arrivalDate ?? '',
      payDocType: row.payDocType ?? '',
      payDocNo: row.payDocNo ?? '',
      payDocDate: row.payDocDate ?? '',
      paymentTerm: row.paymentTerm ?? '',
      bankAccountNo: row.bankAccountNo ?? '',
      bankName: row.bankName ?? '',
      latestShipDate: row.latestShipDate ?? '',
      expShipDate: row.expShipDate ?? '',
      invoiceNo: row.invoiceNo ?? '',
      invoiceDate: row.invoiceDate ?? '',
      blNo: row.blNo ?? '',
      blDate: row.blDate ?? '',
      vessel: row.vessel ?? '',
      sealNo: row.sealNo ?? '',
      containerNo: row.containerNo ?? '',
      grossWeight: row.grossWeight ?? '',
      cbm: row.cbm ?? '',
      blArrivalDate: row.blArrivalDate ?? '',
      blIssuePlace: row.blIssuePlace ?? '',
      loadType: row.loadType,
      batchNo: row.batchNo ?? '',
      mfgDate: row.mfgDate ?? '',
      expiryDate: row.expiryDate ?? '',
      reEvalDate: row.reEvalDate ?? '',
      trackNo: row.trackNo ?? '',
      documents: Array.isArray(row.documents) ? row.documents : [],
      history: Array.isArray(row.history) ? row.history : [],
      createdBy: row.createdBy,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private async generateShipmentNo(customNo?: string): Promise<string> {
    if (customNo?.trim()) {
      const no = customNo.trim();
      const exists = await this.prisma.tradeShipment.findUnique({
        where: { no },
      });
      if (exists) {
        throw new ConflictException(`Shipment '${no}' already exists.`);
      }
      return no;
    }

    const latest = await this.prisma.tradeShipment.findFirst({
      where: { no: { startsWith: '50226' } },
      orderBy: { no: 'desc' },
      select: { no: true },
    });

    const lastNum = latest
      ? parseInt(latest.no, 10) || SHIPMENT_BASE_NO
      : SHIPMENT_BASE_NO;
    return String(Math.max(lastNum, SHIPMENT_BASE_NO) + 1);
  }

  private mapShipmentItems(lines: ShipmentItemDto[]) {
    return lines.map((l) => ({
      productId: clean(l.productId) ?? null,
      product: l.product.trim(),
      description: clean(l.description) ?? null,
      indentQty:
        l.qty !== undefined ? new Prisma.Decimal(l.qty) : new Prisma.Decimal(l.shipQty),
      shippedQty: new Prisma.Decimal(l.shipQty),
      unit: l.unit.trim(),
      rate: new Prisma.Decimal(l.rate),
    }));
  }

  private async validateAgainstIndent(
    indentNo: string,
    lines: ShipmentItemDto[],
    excludeShipmentNo?: string,
  ) {
    const indent = await this.prisma.indent.findUnique({
      where: { no: indentNo },
      include: { items: true },
    });

    if (!indent) return null;

    if (indent.status === 'Cancelled') {
      throw new BadRequestException(
        `Indent '${indentNo}' is cancelled and cannot be shipped.`,
      );
    }

    const otherShipments = await this.prisma.tradeShipment.findMany({
      where: {
        indentNo,
        ...(excludeShipmentNo ? { no: { not: excludeShipmentNo } } : {}),
      },
      include: { items: true },
    });

    for (const line of lines) {
      const indentLine = indent.items.find(
        (i) => i.product.toLowerCase() === line.product.trim().toLowerCase(),
      );
      if (!indentLine) continue;

      const shippedElsewhere = otherShipments.reduce(
        (sum, s) =>
          sum +
          s.items
            .filter(
              (x) =>
                x.product.toLowerCase() === line.product.trim().toLowerCase(),
            )
            .reduce((a, x) => a + Number(x.shippedQty), 0),
        0,
      );

      const remaining = Number(indentLine.quantity) - shippedElsewhere;
      if (line.shipQty > remaining + 0.0001) {
        throw new BadRequestException(
          `Only ${remaining} ${indentLine.unit} remaining on indent '${indentNo}' for product '${line.product}'.`,
        );
      }
    }

    return indent;
  }

  private async syncIndentShipStatus(
    tx: Prisma.TransactionClient,
    indentNo: string,
  ) {
    const indent = await tx.indent.findUnique({
      where: { no: indentNo },
      include: { items: true },
    });
    if (!indent) return;

    const shipments = await tx.tradeShipment.findMany({
      where: { indentNo },
      include: { items: true },
    });

    const ordered = indent.items.reduce(
      (sum, item) => sum + Number(item.quantity),
      0,
    );
    const shipped = shipments.reduce(
      (sum, s) =>
        sum + s.items.reduce((a, item) => a + Number(item.shippedQty), 0),
      0,
    );

    const nextStatus =
      shipped <= 0
        ? 'Not Shipped'
        : shipped >= ordered
          ? 'Shipped'
          : 'Partial';

    if (indent.shipStatus !== nextStatus) {
      await tx.indent.update({
        where: { id: indent.id },
        data: { shipStatus: nextStatus },
      });
    }
  }

  private async allowedIndentNos(
    scopeIds: string[] | null,
  ): Promise<Set<string> | null> {
    if (scopeIds === null) return null;
    const indents = await this.prisma.indent.findMany({
      where: { createdBy: { in: scopeIds } },
      select: { no: true },
    });
    return new Set(indents.map((i) => i.no));
  }

  private filterByScope(
    rows: any[],
    scopeIds: string[] | null,
    allowedIndents: Set<string> | null,
  ) {
    if (scopeIds === null) return rows;
    const userSet = new Set(scopeIds);
    return rows.filter(
      (r) =>
        (allowedIndents && allowedIndents.has(r.indentNo)) ||
        (r.createdBy && userSet.has(r.createdBy)),
    );
  }

  private async findShipmentOrFail(noOrId: string) {
    const shipment = await this.prisma.tradeShipment.findFirst({
      where: { OR: [{ no: noOrId }, { id: noOrId }] },
      include: { items: true },
    });
    if (!shipment) {
      throw new NotFoundException(`Shipment '${noOrId}' not found.`);
    }
    return shipment;
  }

  async list(user: any, query: QueryShipmentDto) {
    await this.access.assertScreenPermission(user, 'Shipment', 'view');

    const scopeIds = await this.access.resolveScopeUserIds(user);
    const allowedIndents = await this.allowedIndentNos(scopeIds);
    const q = query.search?.trim();

    const dateFilter: Prisma.StringFilter = {};
    if (query.from?.trim()) dateFilter.gte = query.from.trim();
    if (query.to?.trim()) dateFilter.lte = query.to.trim();

    const rows = await this.prisma.tradeShipment.findMany({
      where: {
        ...(Object.keys(dateFilter).length ? { shipmentDate: dateFilter } : {}),
        ...(query.indentNo ? { indentNo: query.indentNo } : {}),
        ...(query.supplier && query.supplier !== 'All'
          ? { supplier: { equals: query.supplier, mode: 'insensitive' } }
          : {}),
        ...(query.customer && query.customer !== 'All'
          ? { customer: { equals: query.customer, mode: 'insensitive' } }
          : {}),
        ...(query.salesperson && query.salesperson !== 'All'
          ? { salesperson: { equals: query.salesperson, mode: 'insensitive' } }
          : {}),
        ...(query.commercialPerson && query.commercialPerson !== 'All'
          ? {
              commercialPerson: {
                equals: query.commercialPerson,
                mode: 'insensitive',
              },
            }
          : {}),
        ...(query.debit === 'Ready'
          ? { readyForDebitNote: true }
          : query.debit === 'Not ready'
            ? { readyForDebitNote: false }
            : {}),
        ...(q
          ? {
              OR: [
                { no: { contains: q, mode: 'insensitive' } },
                { indentNo: { contains: q, mode: 'insensitive' } },
                { customer: { contains: q, mode: 'insensitive' } },
                { supplier: { contains: q, mode: 'insensitive' } },
                { invoiceNo: { contains: q, mode: 'insensitive' } },
                { blNo: { contains: q, mode: 'insensitive' } },
                { lotNo: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return this.filterByScope(rows, scopeIds, allowedIndents).map((r) =>
      this.formatShipment(r),
    );
  }

  async getReport(user: any, query: QueryShipmentDto) {
    await this.access.assertScreenPermission(user, 'Shipment Report', 'view');

    const scopeIds = await this.access.resolveScopeUserIds(user);
    const allowedIndents = await this.allowedIndentNos(scopeIds);

    const dateFilter: Prisma.StringFilter = {};
    if (query.from?.trim()) dateFilter.gte = query.from.trim();
    if (query.to?.trim()) dateFilter.lte = query.to.trim();

    const rows = await this.prisma.tradeShipment.findMany({
      where: {
        ...(Object.keys(dateFilter).length ? { shipmentDate: dateFilter } : {}),
        ...(query.supplier && query.supplier !== 'All'
          ? { supplier: { equals: query.supplier, mode: 'insensitive' } }
          : {}),
        ...(query.customer && query.customer !== 'All'
          ? { customer: { equals: query.customer, mode: 'insensitive' } }
          : {}),
        ...(query.salesperson && query.salesperson !== 'All'
          ? { salesperson: { equals: query.salesperson, mode: 'insensitive' } }
          : {}),
        ...(query.commercialPerson && query.commercialPerson !== 'All'
          ? {
              commercialPerson: {
                equals: query.commercialPerson,
                mode: 'insensitive',
              },
            }
          : {}),
        ...(query.debit === 'Ready'
          ? { readyForDebitNote: true }
          : query.debit === 'Not ready'
            ? { readyForDebitNote: false }
            : {}),
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    const items = this.filterByScope(rows, scopeIds, allowedIndents).map((r) =>
      this.formatShipment(r),
    );

    const totalValue =
      Math.round(
        items.reduce((sum, s) => sum + s.totalAmount, 0) * 100,
      ) / 100;

    return {
      stats: {
        totalShipments: items.length,
        readyForDebitNote: items.filter((s) => s.readyForDebitNote).length,
        totalValue,
      },
      items,
    };
  }

  async getByNo(user: any, noOrId: string) {
    const shipment = await this.findShipmentOrFail(noOrId);
    await this.access.assertScreenPermission(user, 'Shipment', 'view');
    await this.access.assertRecordOwnership(
      user,
      shipment.indentNo,
      shipment.createdBy,
    );
    return this.formatShipment(shipment);
  }

  async create(user: any, dto: CreateShipmentDto) {
    await this.access.assertScreenPermission(user, 'Shipment', 'create');

    const indentNo = dto.indentNo.trim();
    const indent = await this.validateAgainstIndent(indentNo, dto.lines);
    if (indent) {
      await this.access.assertRecordOwnership(
        user,
        indent.no,
        indent.createdBy,
      );
    }

    const no = await this.generateShipmentNo(dto.no);
    const itemRows = this.mapShipmentItems(dto.lines);

    const created = await this.prisma.$transaction(async (tx) => {
      const shipment = await tx.tradeShipment.create({
        data: {
          no,
          shipmentDate: dto.date.trim(),
          lotNo: clean(dto.lotNo) ?? null,
          indentNo,
          indentDate: clean(dto.indentDate) ?? indent?.indentDate ?? null,
          lcNo: clean(dto.lcNo) ?? null,
          lcDate: clean(dto.lcDate) ?? null,
          lcExpiry: clean(dto.lcExpiry) ?? null,
          lcBank: clean(dto.lcBank) ?? null,
          lcAccountNo: clean(dto.lcAccountNo) ?? null,
          supplier: dto.supplier.trim(),
          customer: dto.customer.trim(),
          salesperson: clean(dto.salesperson) ?? indent?.salesperson ?? null,
          commercialPerson:
            clean(dto.commercialPerson) ?? indent?.commercialPerson ?? null,
          invoiceNo: clean(dto.invoiceNo) ?? null,
          invoiceDate: clean(dto.invoiceDate) ?? null,
          blNo: clean(dto.blNo) ?? null,
          blDate: clean(dto.blDate) ?? null,
          shipmentRemarks: clean(dto.shipmentRemarks) ?? null,
          otherRemarks: clean(dto.otherRemarks) ?? null,
          finalRemarks: clean(dto.finalRemarks) ?? null,
          readyForDebitNote: Boolean(dto.readyForDebitNote),
          createdBy: indent?.createdBy ?? user.id,
          items: { create: itemRows },
        },
        include: { items: true },
      });

      await this.syncIndentShipStatus(tx, indentNo);
      return shipment;
    });

    return this.formatShipment(created);
  }

  async update(user: any, noOrId: string, dto: UpdateShipmentDto) {
    const existing = await this.findShipmentOrFail(noOrId);

    await this.access.assertScreenPermission(user, 'Shipment', 'edit');
    await this.access.assertRecordOwnership(
      user,
      existing.indentNo,
      existing.createdBy,
    );

    if (dto.readyForDebitNote === false && existing.readyForDebitNote) {
      const linkedDn = await this.prisma.debitNote.findUnique({
        where: { shipmentNo: existing.no },
      });
      if (linkedDn) {
        throw new BadRequestException(
          `Debit note '${linkedDn.no}' already exists. Delete it before clearing Ready for Debit Note.`,
        );
      }
    }

    if (dto.lines !== undefined) {
      await this.validateAgainstIndent(
        existing.indentNo,
        dto.lines,
        existing.no,
      );
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      if (dto.lines !== undefined) {
        await tx.tradeShipmentItem.deleteMany({
          where: { shipmentNo: existing.no },
        });
        const itemRows = this.mapShipmentItems(dto.lines);
        await tx.tradeShipmentItem.createMany({
          data: itemRows.map((item) => ({ ...item, shipmentNo: existing.no })),
        });
      }

      const row = await tx.tradeShipment.update({
        where: { id: existing.id },
        data: {
          shipmentDate: dto.date?.trim(),
          lotNo: clean(dto.lotNo),
          lcNo: clean(dto.lcNo),
          lcDate: clean(dto.lcDate),
          lcExpiry: clean(dto.lcExpiry),
          lcBank: clean(dto.lcBank),
          lcAccountNo: clean(dto.lcAccountNo),
          supplier: dto.supplier?.trim(),
          customer: dto.customer?.trim(),
          salesperson: clean(dto.salesperson),
          commercialPerson: clean(dto.commercialPerson),
          invoiceNo: clean(dto.invoiceNo),
          invoiceDate: clean(dto.invoiceDate),
          blNo: clean(dto.blNo),
          blDate: clean(dto.blDate),
          shipmentRemarks: clean(dto.shipmentRemarks),
          otherRemarks: clean(dto.otherRemarks),
          finalRemarks: clean(dto.finalRemarks),
          readyForDebitNote: dto.readyForDebitNote,
        },
        include: { items: true },
      });

      await this.syncIndentShipStatus(tx, existing.indentNo);
      return row;
    });

    return this.formatShipment(updated);
  }

  async remove(user: any, noOrId: string) {
    const existing = await this.findShipmentOrFail(noOrId);

    await this.access.assertScreenPermission(user, 'Shipment', 'delete');
    await this.access.assertRecordOwnership(
      user,
      existing.indentNo,
      existing.createdBy,
    );

    const linkedDn = await this.prisma.debitNote.findUnique({
      where: { shipmentNo: existing.no },
    });
    if (linkedDn) {
      throw new BadRequestException(
        `Shipment '${existing.no}' has debit note '${linkedDn.no}'. Delete the debit note first.`,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.tradeShipment.delete({ where: { id: existing.id } });
      await this.syncIndentShipStatus(tx, existing.indentNo);
    });

    return { ok: true, no: existing.no };
  }

  private validateDocDates(
    confDate?: string | null,
    shipmentDate?: string | null,
    mfgDate?: string | null,
    expiryDate?: string | null,
  ) {
    if (confDate && shipmentDate && shipmentDate < confDate) {
      throw new BadRequestException(
        'Shipment date cannot be before the confirmation date.',
      );
    }
    if (mfgDate && expiryDate && expiryDate < mfgDate) {
      throw new BadRequestException(
        'Expiry date cannot be before the manufacture date.',
      );
    }
  }

  private normalizeDocFiles(files?: ShipmentDocFileDto[]) {
    return (files ?? []).map((f, idx) => ({
      id: f.id ?? idx + 1,
      type: f.type.trim(),
      fileName: f.fileName.trim(),
      remarks: f.remarks?.trim() ?? '',
      sent: Boolean(f.sent),
    }));
  }

  private async findDocOrFail(indentNoOrId: string) {
    const doc = await this.prisma.shipmentDocument.findFirst({
      where: { OR: [{ indentNo: indentNoOrId }, { id: indentNoOrId }] },
    });
    if (!doc) {
      throw new NotFoundException(
        `Shipment document for '${indentNoOrId}' not found.`,
      );
    }
    return doc;
  }

  async listDocuments(user: any, search?: string) {
    await this.access.assertScreenPermission(
      user,
      'Shipment Document',
      'view',
    );

    const scopeIds = await this.access.resolveScopeUserIds(user);
    const allowedIndents = await this.allowedIndentNos(scopeIds);
    const q = search?.trim();

    const rows = await this.prisma.shipmentDocument.findMany({
      where: q
        ? {
            OR: [
              { indentNo: { contains: q, mode: 'insensitive' } },
              { customer: { contains: q, mode: 'insensitive' } },
              { supplier: { contains: q, mode: 'insensitive' } },
              { invoiceNo: { contains: q, mode: 'insensitive' } },
              { blNo: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {},
      orderBy: { createdAt: 'desc' },
    });

    return this.filterByScope(rows, scopeIds, allowedIndents).map((r) =>
      this.formatDocument(r),
    );
  }

  async getPendingDocIndents(user: any) {
    await this.access.assertScreenPermission(
      user,
      'Shipment Document',
      'view',
    );

    const scopeIds = await this.access.resolveScopeUserIds(user);
    const shippedIndents = await this.prisma.tradeShipment.findMany({
      select: { indentNo: true, shipmentDate: true },
      orderBy: { shipmentDate: 'desc' },
    });

    const lastShipByIndent = new Map<string, string>();
    for (const s of shippedIndents) {
      if (!lastShipByIndent.has(s.indentNo)) {
        lastShipByIndent.set(s.indentNo, s.shipmentDate);
      }
    }

    const existingDocs = await this.prisma.shipmentDocument.findMany({
      select: { indentNo: true },
    });
    const docSet = new Set(existingDocs.map((d) => d.indentNo));

    const pendingNos = Array.from(lastShipByIndent.keys()).filter(
      (no) => !docSet.has(no),
    );
    if (!pendingNos.length) return [];

    const indents = await this.prisma.indent.findMany({
      where: {
        no: { in: pendingNos },
        status: 'Active',
        ...(scopeIds ? { createdBy: { in: scopeIds } } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    return indents.map((i) => ({
      no: i.no,
      date: i.indentDate,
      customer: i.customer,
      supplier: i.supplier,
      lastShipment: lastShipByIndent.get(i.no) ?? '',
    }));
  }

  async getDocumentByIndent(user: any, indentNoOrId: string) {
    const doc = await this.findDocOrFail(indentNoOrId);
    await this.access.assertScreenPermission(
      user,
      'Shipment Document',
      'view',
    );
    await this.access.assertRecordOwnership(user, doc.indentNo, doc.createdBy);
    return this.formatDocument(doc);
  }

  async createDocument(user: any, dto: CreateShipmentDocDto) {
    await this.access.assertScreenPermission(
      user,
      'Shipment Document',
      'create',
    );

    const indentNo = dto.indentNo.trim();
    const exists = await this.prisma.shipmentDocument.findUnique({
      where: { indentNo },
    });
    if (exists) {
      throw new ConflictException(
        `Shipment document for indent '${indentNo}' already exists.`,
      );
    }

    const indent = await this.prisma.indent.findUnique({
      where: { no: indentNo },
    });
    if (indent) {
      if (indent.status === 'Cancelled') {
        throw new BadRequestException(
          `Indent '${indentNo}' is cancelled and cannot have shipment documents.`,
        );
      }
      await this.access.assertRecordOwnership(
        user,
        indent.no,
        indent.createdBy,
      );
    }

    this.validateDocDates(
      dto.confDate,
      dto.shipmentDate,
      dto.mfgDate,
      dto.expiryDate,
    );

    const created = await this.prisma.shipmentDocument.create({
      data: {
        indentNo,
        supplier: dto.supplier.trim(),
        customer: dto.customer.trim(),
        confNo: clean(dto.confNo) ?? null,
        confDate: clean(dto.confDate) ?? null,
        shipmentDate: clean(dto.shipmentDate) ?? null,
        arrivalDate: clean(dto.arrivalDate) ?? null,
        payDocType: clean(dto.payDocType) ?? null,
        payDocNo: clean(dto.payDocNo) ?? null,
        payDocDate: clean(dto.payDocDate) ?? null,
        paymentTerm: clean(dto.paymentTerm) ?? null,
        bankAccountNo: clean(dto.bankAccountNo) ?? null,
        bankName: clean(dto.bankName) ?? null,
        latestShipDate: clean(dto.latestShipDate) ?? null,
        expShipDate: clean(dto.expShipDate) ?? null,
        invoiceNo: clean(dto.invoiceNo) ?? null,
        invoiceDate: clean(dto.invoiceDate) ?? null,
        blNo: clean(dto.blNo) ?? null,
        blDate: clean(dto.blDate) ?? null,
        vessel: clean(dto.vessel) ?? null,
        sealNo: clean(dto.sealNo) ?? null,
        containerNo: clean(dto.containerNo) ?? null,
        grossWeight: clean(dto.grossWeight) ?? null,
        cbm: clean(dto.cbm) ?? null,
        blArrivalDate: clean(dto.blArrivalDate) ?? null,
        blIssuePlace: clean(dto.blIssuePlace) ?? null,
        loadType: dto.loadType ?? 'FCL',
        batchNo: clean(dto.batchNo) ?? null,
        mfgDate: clean(dto.mfgDate) ?? null,
        expiryDate: clean(dto.expiryDate) ?? null,
        reEvalDate: clean(dto.reEvalDate) ?? null,
        trackNo: clean(dto.trackNo) ?? null,
        documents: this.normalizeDocFiles(
          dto.documents,
        ) as unknown as Prisma.InputJsonValue,
        history: [] as unknown as Prisma.InputJsonValue,
        createdBy: indent?.createdBy ?? user.id,
      },
    });

    return this.formatDocument(created);
  }

  async updateDocument(
    user: any,
    indentNoOrId: string,
    dto: UpdateShipmentDocDto,
  ) {
    const existing = await this.findDocOrFail(indentNoOrId);

    await this.access.assertScreenPermission(
      user,
      'Shipment Document',
      'edit',
    );
    await this.access.assertRecordOwnership(
      user,
      existing.indentNo,
      existing.createdBy,
    );

    const confDate =
      dto.confDate !== undefined ? clean(dto.confDate) : existing.confDate;
    const shipmentDate =
      dto.shipmentDate !== undefined
        ? clean(dto.shipmentDate)
        : existing.shipmentDate;
    const mfgDate =
      dto.mfgDate !== undefined ? clean(dto.mfgDate) : existing.mfgDate;
    const expiryDate =
      dto.expiryDate !== undefined
        ? clean(dto.expiryDate)
        : existing.expiryDate;

    this.validateDocDates(confDate, shipmentDate, mfgDate, expiryDate);

    const updated = await this.prisma.shipmentDocument.update({
      where: { id: existing.id },
      data: {
        supplier: dto.supplier?.trim(),
        customer: dto.customer?.trim(),
        confNo: clean(dto.confNo),
        confDate: clean(dto.confDate),
        shipmentDate: clean(dto.shipmentDate),
        arrivalDate: clean(dto.arrivalDate),
        payDocType: clean(dto.payDocType),
        payDocNo: clean(dto.payDocNo),
        payDocDate: clean(dto.payDocDate),
        paymentTerm: clean(dto.paymentTerm),
        bankAccountNo: clean(dto.bankAccountNo),
        bankName: clean(dto.bankName),
        latestShipDate: clean(dto.latestShipDate),
        expShipDate: clean(dto.expShipDate),
        invoiceNo: clean(dto.invoiceNo),
        invoiceDate: clean(dto.invoiceDate),
        blNo: clean(dto.blNo),
        blDate: clean(dto.blDate),
        vessel: clean(dto.vessel),
        sealNo: clean(dto.sealNo),
        containerNo: clean(dto.containerNo),
        grossWeight: clean(dto.grossWeight),
        cbm: clean(dto.cbm),
        blArrivalDate: clean(dto.blArrivalDate),
        blIssuePlace: clean(dto.blIssuePlace),
        loadType: dto.loadType,
        batchNo: clean(dto.batchNo),
        mfgDate: clean(dto.mfgDate),
        expiryDate: clean(dto.expiryDate),
        reEvalDate: clean(dto.reEvalDate),
        trackNo: clean(dto.trackNo),
        ...(dto.documents !== undefined
          ? {
              documents: this.normalizeDocFiles(
                dto.documents,
              ) as unknown as Prisma.InputJsonValue,
            }
          : {}),
      },
    });

    return this.formatDocument(updated);
  }

  async sendDocument(
    user: any,
    indentNoOrId: string,
    dto: SendShipmentDocDto,
  ) {
    const existing = await this.findDocOrFail(indentNoOrId);

    await this.access.assertScreenPermission(
      user,
      'Shipment Document',
      'edit',
    );
    await this.access.assertRecordOwnership(
      user,
      existing.indentNo,
      existing.createdBy,
    );

    const docs: any[] = Array.isArray(existing.documents)
      ? existing.documents
      : [];
    const unsent = docs.filter((d) => !d.sent);
    if (!unsent.length) {
      throw new BadRequestException(
        'Attach at least one new document to send.',
      );
    }

    const history: any[] = Array.isArray(existing.history)
      ? existing.history
      : [];
    const nextId =
      Math.max(0, ...history.map((h) => Number(h.id) || 0)) + 1;

    const entry = {
      id: nextId,
      to: dto.sendTo,
      at: new Date().toISOString().slice(0, 16),
      types: unsent.map((d) => d.type),
    };

    const updated = await this.prisma.shipmentDocument.update({
      where: { id: existing.id },
      data: {
        documents: docs.map((d) => ({
          ...d,
          sent: true,
        })) as unknown as Prisma.InputJsonValue,
        history: [entry, ...history] as unknown as Prisma.InputJsonValue,
      },
    });

    return this.formatDocument(updated);
  }

  async removeDocument(user: any, indentNoOrId: string) {
    const existing = await this.findDocOrFail(indentNoOrId);

    await this.access.assertScreenPermission(
      user,
      'Shipment Document',
      'delete',
    );
    await this.access.assertRecordOwnership(
      user,
      existing.indentNo,
      existing.createdBy,
    );

    await this.prisma.shipmentDocument.delete({ where: { id: existing.id } });
    return { ok: true, indentNo: existing.indentNo };
  }
}
