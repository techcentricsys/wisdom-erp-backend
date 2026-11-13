import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import {
  CreateOfferDto,
  DenyOfferDto,
  OfferItemDto,
  QueryOfferDto,
  UpdateOfferApprovalDto,
  UpdateOfferDto,
} from './dto.js';
import { OffersAccess } from './offers.access.js';

const OFFER_BASE_NO = 2022600000;

const clean = (val?: string) => {
  if (val === undefined) return undefined;
  const trimmed = val.trim();
  return trimmed.length ? trimmed : null;
};

const todayISO = () => new Date().toISOString().slice(0, 10);

@Injectable()
export class OffersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: OffersAccess,
  ) {}

  private formatOffer(row: any) {
    const lines = (row.items ?? []).map((item: any) => ({
      id: item.id,
      productId: item.productId ?? '',
      product: item.product,
      category: item.category ?? '',
      description: item.description ?? '',
      supplier: item.supplier ?? row.supplier,
      qty: String(item.quantity),
      quantity: Number(item.quantity),
      unit: item.unit,
      rate: String(item.rate),
      comm: String(item.commission ?? 0),
      commission: Number(item.commission ?? 0),
      shippingMode: item.shippingMode ?? '',
      paymentTerm: item.paymentTerm ?? '',
      manufacturer: item.manufacturer ?? '',
      packing: item.packing ?? '',
    }));

    const grandTotal = Math.round(
      lines.reduce(
        (sum: number, l: any) => sum + Number(l.qty || 0) * Number(l.rate || 0),
        0,
      ) * 100,
    ) / 100;

    return {
      id: row.id,
      no: row.no,
      date: row.offerDate,
      offerDate: row.offerDate,
      validity: row.validityDate,
      validityDate: row.validityDate,
      inquiryNo: row.inquiryNo,
      customer: row.customer,
      customerId: row.customerId,
      supplier: row.supplier,
      supplierId: row.supplierId,
      salesperson: row.salesperson ?? '',
      salespersonId: row.salespersonId,
      commercialPerson: row.commercialPerson ?? '',
      portLoading: row.portLoading ?? '',
      portDestination: row.portDestination ?? '',
      partialShipment: row.partialShipment,
      transShipment: row.transShipment,
      shipmentPeriod: row.shipmentPeriod ?? '',
      currency: row.currency,
      incoterm: row.incoterm ?? '',
      insurance: row.insurance ?? '',
      remarks: row.remarks ?? '',
      status: row.status,
      denyDate: row.denyDate ?? '',
      denyReason: row.denyReason ?? '',
      approval: row.approvalStatus,
      approvalStatus: row.approvalStatus,
      approvedBy: row.approvedBy ?? '',
      approvalDate: row.approvalDate ?? '',
      approvalRemark: row.approvalRemark ?? '',
      grandTotal,
      createdBy: row.createdBy,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      lines,
    };
  }

  private async generateOfferNo(customNo?: string): Promise<string> {
    if (customNo?.trim()) {
      const no = customNo.trim();
      const exists = await this.prisma.offer.findUnique({ where: { no } });
      if (exists) throw new ConflictException(`Offer '${no}' already exists.`);
      return no;
    }

    const latest = await this.prisma.offer.findFirst({
      where: { no: { startsWith: '20226' } },
      orderBy: { no: 'desc' },
      select: { no: true },
    });

    const lastNum = latest ? parseInt(latest.no, 10) || OFFER_BASE_NO : OFFER_BASE_NO;
    return String(Math.max(lastNum, OFFER_BASE_NO) + 1);
  }

  private validateDatesAndSupplier(
    date: string,
    validity: string,
    lines: OfferItemDto[],
    headerSupplier?: string,
  ): string {
    if (validity < date) {
      throw new BadRequestException(
        'Validity date cannot be before the offer date.',
      );
    }

    const lineSuppliers = Array.from(
      new Set(
        lines
          .map((l) => l.supplier?.trim())
          .filter((s): s is string => Boolean(s)),
      ),
    );

    if (lineSuppliers.length > 1) {
      throw new BadRequestException(
        `Lines belong to multiple suppliers (${lineSuppliers.join(', ')}). Keep one supplier per offer.`,
      );
    }

    const resolved = lineSuppliers[0] || headerSupplier?.trim() || '';
    if (!resolved) {
      throw new BadRequestException('Supplier is required for the offer.');
    }

    return resolved;
  }

  private mapOfferItems(lines: OfferItemDto[], supplier: string) {
    return lines.map((l) => ({
      productId: clean(l.productId) ?? null,
      product: l.product.trim(),
      category: clean(l.category) ?? null,
      description: clean(l.description) ?? null,
      supplier: clean(l.supplier) ?? supplier,
      quantity: new Prisma.Decimal(l.qty),
      unit: l.unit.trim(),
      rate: new Prisma.Decimal(l.rate),
      commission: new Prisma.Decimal(l.comm ?? 0),
      shippingMode: clean(l.shippingMode) ?? null,
      paymentTerm: clean(l.paymentTerm) ?? null,
      manufacturer: clean(l.manufacturer) ?? null,
      packing: clean(l.packing) ?? null,
    }));
  }

  private async findOfferOrFail(noOrId: string) {
    const offer = await this.prisma.offer.findFirst({
      where: { OR: [{ no: noOrId }, { id: noOrId }] },
      include: { items: true },
    });

    if (!offer) throw new NotFoundException(`Offer '${noOrId}' not found.`);
    return offer;
  }

  async list(user: any, query: QueryOfferDto) {
    await this.access.assertScreenPermission(user, 'Offer', 'view');

    const scopeIds = await this.access.resolveScopeUserIds(user);
    const q = query.search?.trim();

    const where: Prisma.OfferWhereInput = {
      ...(scopeIds ? { createdBy: { in: scopeIds } } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.approval ? { approvalStatus: query.approval } : {}),
      ...(query.inquiryNo ? { inquiryNo: query.inquiryNo } : {}),
      ...(q
        ? {
            OR: [
              { no: { contains: q, mode: 'insensitive' } },
              { inquiryNo: { contains: q, mode: 'insensitive' } },
              { customer: { contains: q, mode: 'insensitive' } },
              { supplier: { contains: q, mode: 'insensitive' } },
              { salesperson: { contains: q, mode: 'insensitive' } },
              { items: { some: { product: { contains: q, mode: 'insensitive' } } } },
            ],
          }
        : {}),
    };

    const rows = await this.prisma.offer.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((r) => this.formatOffer(r));
  }

  async getStatusList(user: any, query: QueryOfferDto) {
    await this.access.assertScreenPermission(user, 'Offer Status', 'view');

    const scopeIds = await this.access.resolveScopeUserIds(user);
    const baseWhere: Prisma.OfferWhereInput = scopeIds
      ? { createdBy: { in: scopeIds } }
      : {};

    const allScoped = await this.prisma.offer.findMany({
      where: baseWhere,
      select: { approvalStatus: true },
    });

    const stats = {
      total: allScoped.length,
      pending: allScoped.filter((o) => o.approvalStatus === 'Pending').length,
      approved: allScoped.filter((o) => o.approvalStatus === 'Approved').length,
      rejected: allScoped.filter((o) => o.approvalStatus === 'Rejected').length,
    };

    const q = query.search?.trim();
    const rows = await this.prisma.offer.findMany({
      where: {
        ...baseWhere,
        ...(query.approval ? { approvalStatus: query.approval } : {}),
        ...(query.status ? { status: query.status } : {}),
        ...(q
          ? {
              OR: [
                { no: { contains: q, mode: 'insensitive' } },
                { inquiryNo: { contains: q, mode: 'insensitive' } },
                { customer: { contains: q, mode: 'insensitive' } },
                { supplier: { contains: q, mode: 'insensitive' } },
                { salesperson: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return {
      stats,
      items: rows.map((r) => this.formatOffer(r)),
    };
  }

  async getByNo(user: any, noOrId: string) {
    const offer = await this.findOfferOrFail(noOrId);
    await this.access.assertScreenPermission(user, 'Offer', 'view');
    await this.access.assertRecordOwnership(user, offer.createdBy);
    return this.formatOffer(offer);
  }

  async create(user: any, dto: CreateOfferDto) {
    await this.access.assertScreenPermission(user, 'Offer', 'create');

    const date = dto.date.trim();
    const validity = dto.validity.trim();
    const supplier = this.validateDatesAndSupplier(
      date,
      validity,
      dto.lines,
      dto.supplier,
    );
    const no = await this.generateOfferNo(dto.no);
    const itemRows = this.mapOfferItems(dto.lines, supplier);

    const created = await this.prisma.offer.create({
      data: {
        no,
        offerDate: date,
        validityDate: validity,
        inquiryNo: dto.inquiryNo.trim(),
        customer: dto.customer.trim(),
        customerId: clean(dto.customerId) ?? null,
        supplier,
        supplierId: clean(dto.supplierId) ?? null,
        salesperson: clean(dto.salesperson) ?? null,
        salespersonId: clean(dto.salespersonId) ?? null,
        commercialPerson: clean(dto.commercialPerson) ?? null,
        portLoading: clean(dto.portLoading) ?? null,
        portDestination: clean(dto.portDestination) ?? null,
        partialShipment: dto.partialShipment ?? 'Allowed',
        transShipment: dto.transShipment ?? 'Allowed',
        shipmentPeriod: clean(dto.shipmentPeriod) ?? null,
        currency: clean(dto.currency) ?? 'US DOLLAR',
        incoterm: clean(dto.incoterm) ?? null,
        insurance: clean(dto.insurance) ?? null,
        remarks: clean(dto.remarks) ?? null,
        status: 'Open',
        approvalStatus: 'Pending',
        createdBy: user.id,
        items: { create: itemRows },
      },
      include: { items: true },
    });

    return this.formatOffer(created);
  }

  async update(user: any, noOrId: string, dto: UpdateOfferDto) {
    const existing = await this.findOfferOrFail(noOrId);

    await this.access.assertScreenPermission(user, 'Offer', 'edit');
    await this.access.assertRecordOwnership(user, existing.createdBy);

    if (existing.status !== 'Open') {
      throw new BadRequestException(
        existing.status === 'Indented'
          ? `Offer ${existing.no} has an indent and is read-only.`
          : 'Denied offers are read-only.',
      );
    }

    const nextDate = dto.date?.trim() ?? existing.offerDate;
    const nextValidity = dto.validity?.trim() ?? existing.validityDate;

    const currentLines: OfferItemDto[] =
      dto.lines ??
      existing.items.map((item) => ({
        productId: item.productId ?? undefined,
        product: item.product,
        category: item.category ?? undefined,
        description: item.description ?? undefined,
        supplier: item.supplier ?? existing.supplier,
        qty: Number(item.quantity),
        unit: item.unit,
        rate: Number(item.rate),
        comm: Number(item.commission ?? 0),
        shippingMode: item.shippingMode ?? undefined,
        paymentTerm: item.paymentTerm ?? undefined,
        manufacturer: item.manufacturer ?? undefined,
        packing: item.packing ?? undefined,
      }));

    const nextSupplier = this.validateDatesAndSupplier(
      nextDate,
      nextValidity,
      currentLines,
      dto.supplier ?? existing.supplier,
    );

    const updated = await this.prisma.$transaction(async (tx) => {
      if (dto.lines !== undefined) {
        await tx.offerItem.deleteMany({ where: { offerNo: existing.no } });
        const itemRows = this.mapOfferItems(dto.lines, nextSupplier);
        await tx.offerItem.createMany({
          data: itemRows.map((item) => ({ ...item, offerNo: existing.no })),
        });
      }

      return tx.offer.update({
        where: { id: existing.id },
        data: {
          offerDate: nextDate,
          validityDate: nextValidity,
          inquiryNo: dto.inquiryNo?.trim(),
          customer: dto.customer?.trim(),
          customerId: clean(dto.customerId),
          supplier: nextSupplier,
          supplierId: clean(dto.supplierId),
          salesperson: clean(dto.salesperson),
          salespersonId: clean(dto.salespersonId),
          commercialPerson: clean(dto.commercialPerson),
          portLoading: clean(dto.portLoading),
          portDestination: clean(dto.portDestination),
          partialShipment: dto.partialShipment,
          transShipment: dto.transShipment,
          shipmentPeriod: clean(dto.shipmentPeriod),
          currency: dto.currency?.trim(),
          incoterm: clean(dto.incoterm),
          insurance: clean(dto.insurance),
          remarks: clean(dto.remarks),
          status: dto.status,
        },
        include: { items: true },
      });
    });

    return this.formatOffer(updated);
  }

  async deny(user: any, noOrId: string, dto: DenyOfferDto) {
    const existing = await this.findOfferOrFail(noOrId);

    await this.access.assertScreenPermission(user, 'Offer', 'edit');
    await this.access.assertRecordOwnership(user, existing.createdBy);

    if (existing.status === 'Indented') {
      throw new BadRequestException(
        `Offer ${existing.no} has an indent and cannot be denied.`,
      );
    }

    const updated = await this.prisma.offer.update({
      where: { id: existing.id },
      data: {
        status: 'Denied',
        denyDate: todayISO(),
        denyReason: dto.reason.trim(),
      },
      include: { items: true },
    });

    return this.formatOffer(updated);
  }

  async updateApproval(user: any, noOrId: string, dto: UpdateOfferApprovalDto) {
    const existing = await this.findOfferOrFail(noOrId);

    await this.access.assertCanApproveOffers(user);
    await this.access.assertRecordOwnership(user, existing.createdBy);

    if (dto.approval === 'Rejected') {
      if (existing.status === 'Indented') {
        throw new BadRequestException(
          `Offer ${existing.no} already has an indent and cannot be rejected.`,
        );
      }
      if (!dto.remark?.trim()) {
        throw new BadRequestException(
          'Remark is required when rejecting an offer.',
        );
      }
    }

    const isPending = dto.approval === 'Pending';
    const approverName =
      `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email;

    const updated = await this.prisma.offer.update({
      where: { id: existing.id },
      data: {
        approvalStatus: dto.approval,
        approvalRemark: clean(dto.remark) ?? null,
        approvedBy: isPending ? null : approverName,
        approvalDate: isPending ? null : todayISO(),
      },
      include: { items: true },
    });

    return this.formatOffer(updated);
  }

  async remove(user: any, noOrId: string) {
    const existing = await this.findOfferOrFail(noOrId);

    await this.access.assertScreenPermission(user, 'Offer', 'delete');
    await this.access.assertRecordOwnership(user, existing.createdBy);

    if (existing.status === 'Indented') {
      throw new BadRequestException(
        `Offer ${existing.no} has an indent. Delete the indent first.`,
      );
    }

    await this.prisma.offer.delete({ where: { id: existing.id } });
    return { ok: true, no: existing.no };
  }
}
