import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import {
  CreateIndentDto,
  IndentItemDto,
  QueryIndentDto,
  UpdateIndentDto,
} from './dto.js';
import { IndentsAccess } from './indents.access.js';

const INDENT_BASE_NO = 4022600000;

const clean = (val?: string) => {
  if (val === undefined) return undefined;
  const trimmed = val.trim();
  return trimmed.length ? trimmed : null;
};

const todayISO = () => new Date().toISOString().slice(0, 10);

@Injectable()
export class IndentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: IndentsAccess,
  ) {}

  private formatIndent(row: any) {
    const lines = (row.items ?? []).map((item: any) => ({
      id: item.id,
      productId: item.productId ?? '',
      product: item.product,
      category: item.category ?? '',
      description: item.description ?? '',
      qty: String(item.quantity),
      quantity: Number(item.quantity),
      unit: item.unit,
      rate: String(item.rate),
      comm: String(item.commissionPct ?? 0),
      commissionPct: Number(item.commissionPct ?? 0),
      shippingMode: item.shippingMode ?? '',
      paymentTerm: item.paymentTerm ?? '',
      manufacturer: item.manufacturer ?? '',
      packing: item.packing ?? '',
    }));

    const grandTotal =
      Math.round(
        lines.reduce(
          (sum: number, l: any) =>
            sum + Number(l.qty || 0) * Number(l.rate || 0),
          0,
        ) * 100,
      ) / 100;

    return {
      id: row.id,
      no: row.no,
      date: row.indentDate,
      indentDate: row.indentDate,
      validity: row.validityDate,
      validityDate: row.validityDate,
      offerNo: row.offerNo,
      offerDate: row.offerDate ?? '',
      refNo: row.refNo ?? '',
      customer: row.customer,
      customerId: row.customerId,
      supplier: row.supplier,
      supplierId: row.supplierId,
      salesperson: row.salesperson ?? '',
      salespersonId: row.salespersonId,
      commercialPerson: row.commercialPerson ?? '',
      portLoading: row.portLoading ?? '',
      portDestination: row.portDestination ?? '',
      currency: row.currency,
      incoterm: row.incoterm ?? '',
      insurance: row.insurance ?? '',
      shippingAgent: row.shippingAgent ?? '',
      shippingMark: row.shippingMark ?? '',
      partialShipment: row.partialShipment,
      transShipment: row.transShipment,
      shipmentPeriod: row.shipmentPeriod ?? '',
      bankType: row.bankType,
      specialNote: row.specialNote ?? '',
      instruction: row.instruction ?? '',
      remarks: row.remarks ?? '',
      checklist: Array.isArray(row.checklist) ? row.checklist : [],
      printWithLogo: Boolean(row.printWithLogo),
      status: row.status,
      cancelDate: row.cancelDate ?? '',
      poStatus: row.poStatus,
      shipStatus: row.shipStatus,
      grandTotal,
      createdBy: row.createdBy,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      lines,
    };
  }

  private async generateIndentNo(customNo?: string): Promise<string> {
    if (customNo?.trim()) {
      const no = customNo.trim();
      const exists = await this.prisma.indent.findUnique({ where: { no } });
      if (exists) throw new ConflictException(`Indent '${no}' already exists.`);
      return no;
    }

    const latest = await this.prisma.indent.findFirst({
      where: { no: { startsWith: '40226' } },
      orderBy: { no: 'desc' },
      select: { no: true },
    });

    const lastNum = latest
      ? parseInt(latest.no, 10) || INDENT_BASE_NO
      : INDENT_BASE_NO;
    return String(Math.max(lastNum, INDENT_BASE_NO) + 1);
  }

  private mapIndentItems(lines: IndentItemDto[]) {
    return lines.map((l) => ({
      productId: clean(l.productId) ?? null,
      product: l.product.trim(),
      category: clean(l.category) ?? null,
      description: clean(l.description) ?? null,
      quantity: new Prisma.Decimal(l.qty),
      unit: l.unit.trim(),
      rate: new Prisma.Decimal(l.rate),
      commissionPct: new Prisma.Decimal(l.comm ?? 0),
      shippingMode: clean(l.shippingMode) ?? null,
      paymentTerm: clean(l.paymentTerm) ?? null,
      manufacturer: clean(l.manufacturer) ?? null,
      packing: clean(l.packing) ?? null,
    }));
  }

  private async findIndentOrFail(noOrId: string) {
    const indent = await this.prisma.indent.findFirst({
      where: { OR: [{ no: noOrId }, { id: noOrId }] },
      include: { items: true },
    });

    if (!indent) throw new NotFoundException(`Indent '${noOrId}' not found.`);
    return indent;
  }

  private buildWhere(
    scopeIds: string[] | null,
    query: QueryIndentDto,
  ): Prisma.IndentWhereInput {
    const q = query.search?.trim();
    const dateFilter: Prisma.StringFilter = {};
    if (query.from?.trim()) dateFilter.gte = query.from.trim();
    if (query.to?.trim()) dateFilter.lte = query.to.trim();

    return {
      ...(scopeIds ? { createdBy: { in: scopeIds } } : {}),
      ...(Object.keys(dateFilter).length ? { indentDate: dateFilter } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.poStatus ? { poStatus: query.poStatus } : {}),
      ...(query.shipStatus ? { shipStatus: query.shipStatus } : {}),
      ...(query.offerNo ? { offerNo: query.offerNo } : {}),
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
      ...(query.shippingAgent?.trim()
        ? {
            shippingAgent: {
              contains: query.shippingAgent.trim(),
              mode: 'insensitive',
            },
          }
        : {}),
      ...(query.product && query.product !== 'All'
        ? {
            items: {
              some: {
                product: { equals: query.product, mode: 'insensitive' },
              },
            },
          }
        : {}),
      ...(q
        ? {
            OR: [
              { no: { contains: q, mode: 'insensitive' } },
              { offerNo: { contains: q, mode: 'insensitive' } },
              { refNo: { contains: q, mode: 'insensitive' } },
              { customer: { contains: q, mode: 'insensitive' } },
              { supplier: { contains: q, mode: 'insensitive' } },
              { salesperson: { contains: q, mode: 'insensitive' } },
              {
                items: {
                  some: { product: { contains: q, mode: 'insensitive' } },
                },
              },
            ],
          }
        : {}),
    };
  }

  async list(user: any, query: QueryIndentDto) {
    await this.access.assertScreenPermission(user, 'Indent', 'view');

    const scopeIds = await this.access.resolveScopeUserIds(user);
    const where = this.buildWhere(scopeIds, query);

    const rows = await this.prisma.indent.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((r) => this.formatIndent(r));
  }

  async getReport(user: any, query: QueryIndentDto) {
    await this.access.assertScreenPermission(user, 'Indent Report', 'view');

    const scopeIds = await this.access.resolveScopeUserIds(user);
    const where = this.buildWhere(scopeIds, query);

    const rows = await this.prisma.indent.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = rows.map((r) => this.formatIndent(r));
    const productFilter =
      query.product && query.product !== 'All'
        ? query.product.trim().toLowerCase()
        : null;

    const lineRows = formatted.flatMap((indent) =>
      indent.lines
        .filter(
          (l: any) =>
            !productFilter || l.product.toLowerCase() === productFilter,
        )
        .map((line: any, idx: number) => ({
          key: `${indent.no}-${idx}`,
          indentNo: indent.no,
          date: indent.date,
          offerNo: indent.offerNo,
          customer: indent.customer,
          supplier: indent.supplier,
          salesperson: indent.salesperson,
          commercialPerson: indent.commercialPerson,
          shippingAgent: indent.shippingAgent,
          poStatus: indent.poStatus,
          shipStatus: indent.shipStatus,
          status: indent.status,
          createdBy: indent.createdBy,
          line,
        })),
    );

    const stats = {
      totalIndents: formatted.length,
      totalLines: lineRows.length,
      active: formatted.filter((i) => i.status === 'Active').length,
      poPending: formatted.filter(
        (i) => i.status === 'Active' && i.poStatus === 'PO Pending',
      ).length,
      notShipped: formatted.filter(
        (i) => i.status === 'Active' && i.shipStatus !== 'Shipped',
      ).length,
    };

    return {
      stats,
      indents: formatted,
      rows: lineRows,
    };
  }

  async getByNo(user: any, noOrId: string) {
    const indent = await this.findIndentOrFail(noOrId);
    await this.access.assertScreenPermission(user, 'Indent', 'view');
    await this.access.assertRecordOwnership(user, indent.createdBy);
    return this.formatIndent(indent);
  }

  async create(user: any, dto: CreateIndentDto) {
    await this.access.assertScreenPermission(user, 'Indent', 'create');

    const date = dto.date.trim();
    const validity = dto.validity.trim();
    if (validity < date) {
      throw new BadRequestException(
        'Validity cannot be before the indent date.',
      );
    }

    const offerNo = dto.offerNo.trim();
    const linkedOffer = await this.prisma.offer.findUnique({
      where: { no: offerNo },
    });

    if (linkedOffer && linkedOffer.status === 'Denied') {
      throw new BadRequestException(
        `Offer '${offerNo}' is denied and cannot be indented.`,
      );
    }

    const no = await this.generateIndentNo(dto.no);
    const itemRows = this.mapIndentItems(dto.lines);

    const created = await this.prisma.$transaction(async (tx) => {
      const indent = await tx.indent.create({
        data: {
          no,
          indentDate: date,
          validityDate: validity,
          offerNo,
          offerDate: clean(dto.offerDate) ?? linkedOffer?.offerDate ?? null,
          refNo: clean(dto.refNo) ?? null,
          customer: dto.customer.trim(),
          customerId: clean(dto.customerId) ?? null,
          supplier: dto.supplier.trim(),
          supplierId: clean(dto.supplierId) ?? null,
          salesperson: clean(dto.salesperson) ?? null,
          salespersonId: clean(dto.salespersonId) ?? null,
          commercialPerson: clean(dto.commercialPerson) ?? null,
          portLoading: clean(dto.portLoading) ?? null,
          portDestination: clean(dto.portDestination) ?? null,
          currency: clean(dto.currency) ?? 'US DOLLAR',
          incoterm: clean(dto.incoterm) ?? null,
          insurance: clean(dto.insurance) ?? null,
          shippingAgent: clean(dto.shippingAgent) ?? null,
          shippingMark: clean(dto.shippingMark) ?? null,
          partialShipment: dto.partialShipment ?? 'Allowed',
          transShipment: dto.transShipment ?? 'Allowed',
          shipmentPeriod: clean(dto.shipmentPeriod) ?? null,
          bankType: dto.bankType ?? 'Bank',
          specialNote: clean(dto.specialNote) ?? null,
          instruction: clean(dto.instruction) ?? null,
          remarks: clean(dto.remarks) ?? null,
          checklist: dto.checklist
            ? (dto.checklist.map((c) => c.trim()).filter(Boolean) as unknown as Prisma.InputJsonValue)
            : ([] as unknown as Prisma.InputJsonValue),
          printWithLogo: Boolean(dto.printWithLogo),
          status: 'Active',
          poStatus: 'PO Pending',
          shipStatus: 'Not Shipped',
          createdBy: user.id,
          items: { create: itemRows },
        },
        include: { items: true },
      });

      if (linkedOffer && linkedOffer.status !== 'Indented') {
        await tx.offer.update({
          where: { id: linkedOffer.id },
          data: { status: 'Indented' },
        });
      }

      return indent;
    });

    return this.formatIndent(created);
  }

  async update(user: any, noOrId: string, dto: UpdateIndentDto) {
    const existing = await this.findIndentOrFail(noOrId);

    await this.access.assertScreenPermission(user, 'Indent', 'edit');
    await this.access.assertRecordOwnership(user, existing.createdBy);

    if (existing.status === 'Cancelled') {
      throw new BadRequestException('Cancelled indents are read-only.');
    }

    const nextDate = dto.date?.trim() ?? existing.indentDate;
    const nextValidity = dto.validity?.trim() ?? existing.validityDate;
    if (nextValidity < nextDate) {
      throw new BadRequestException(
        'Validity cannot be before the indent date.',
      );
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      if (dto.lines !== undefined) {
        await tx.indentItem.deleteMany({ where: { indentNo: existing.no } });
        const itemRows = this.mapIndentItems(dto.lines);
        await tx.indentItem.createMany({
          data: itemRows.map((item) => ({ ...item, indentNo: existing.no })),
        });
      }

      return tx.indent.update({
        where: { id: existing.id },
        data: {
          indentDate: nextDate,
          validityDate: nextValidity,
          refNo: clean(dto.refNo),
          customer: dto.customer?.trim(),
          customerId: clean(dto.customerId),
          supplier: dto.supplier?.trim(),
          supplierId: clean(dto.supplierId),
          salesperson: clean(dto.salesperson),
          salespersonId: clean(dto.salespersonId),
          commercialPerson: clean(dto.commercialPerson),
          portLoading: clean(dto.portLoading),
          portDestination: clean(dto.portDestination),
          currency: dto.currency?.trim(),
          incoterm: clean(dto.incoterm),
          insurance: clean(dto.insurance),
          shippingAgent: clean(dto.shippingAgent),
          shippingMark: clean(dto.shippingMark),
          partialShipment: dto.partialShipment,
          transShipment: dto.transShipment,
          shipmentPeriod: clean(dto.shipmentPeriod),
          bankType: dto.bankType,
          specialNote: clean(dto.specialNote),
          instruction: clean(dto.instruction),
          remarks: clean(dto.remarks),
          printWithLogo: dto.printWithLogo,
          poStatus: dto.poStatus,
          shipStatus: dto.shipStatus,
          ...(dto.checklist !== undefined
            ? {
                checklist: dto.checklist
                  .map((c) => c.trim())
                  .filter(Boolean) as unknown as Prisma.InputJsonValue,
              }
            : {}),
        },
        include: { items: true },
      });
    });

    return this.formatIndent(updated);
  }

  async cancel(user: any, noOrId: string) {
    const existing = await this.findIndentOrFail(noOrId);

    await this.access.assertScreenPermission(user, 'Indent', 'edit');
    await this.access.assertRecordOwnership(user, existing.createdBy);

    if (existing.status === 'Cancelled') {
      throw new BadRequestException(`Indent ${existing.no} is already cancelled.`);
    }

    if (existing.shipStatus !== 'Not Shipped' || existing.poStatus === 'PO Issued') {
      throw new BadRequestException(
        `Indent ${existing.no} already has ${existing.shipStatus !== 'Not Shipped' ? 'shipments' : 'an active purchase order'} and cannot be cancelled.`,
      );
    }

    const updated = await this.prisma.indent.update({
      where: { id: existing.id },
      data: {
        status: 'Cancelled',
        cancelDate: todayISO(),
      },
      include: { items: true },
    });

    return this.formatIndent(updated);
  }

  async remove(user: any, noOrId: string) {
    const existing = await this.findIndentOrFail(noOrId);

    await this.access.assertScreenPermission(user, 'Indent', 'delete');
    await this.access.assertRecordOwnership(user, existing.createdBy);

    if (existing.shipStatus !== 'Not Shipped' || existing.poStatus === 'PO Issued') {
      throw new BadRequestException(
        `Indent ${existing.no} has linked purchase orders or shipments. Delete those first.`,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.indent.delete({ where: { id: existing.id } });

      const remainingForOffer = await tx.indent.count({
        where: { offerNo: existing.offerNo },
      });

      if (remainingForOffer === 0) {
        await tx.offer.updateMany({
          where: { no: existing.offerNo, status: 'Indented' },
          data: { status: 'Open' },
        });
      }
    });

    return { ok: true, no: existing.no };
  }
}
