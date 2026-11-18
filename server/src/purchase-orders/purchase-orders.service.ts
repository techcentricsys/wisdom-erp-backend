import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PurchaseOrderStatus } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import { IndentsAccess } from '../indents/indents.access.js';
import {
  CreatePurchaseOrderDto,
  PurchaseOrderLineDto,
  QueryPurchaseOrderDto,
  UpdatePurchaseOrderDto,
} from './dto.js';

const PO_BASE = (year: number) => Number(`302${String(year).slice(-2)}00000`);
const clean = (value?: string | null) => value?.trim() || null;
const dateOnly = (value: Date | null | undefined) =>
  value ? value.toISOString().slice(0, 10) : '';
const asDate = (value: string) => new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
const issueStatuses: PurchaseOrderStatus[] = [
  'SENT',
  'CONFIRMED',
  'PARTIALLY_RECEIVED',
  'RECEIVED',
];

@Injectable()
export class PurchaseOrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: IndentsAccess,
  ) {}

  private format(row: any) {
    return {
      id: row.id,
      no: row.orderNo,
      orderNo: row.orderNo,
      date: dateOnly(row.orderDate),
      deliveryDate: dateOnly(row.expectedDate),
      indentNo: row.indentNo ?? '',
      supplier: row.supplierName || row.supplierAccount?.name || row.supplier?.name || '',
      supplierId: row.supplierAccountId ?? row.supplierId ?? '',
      customer: row.customer ?? row.indent?.customer ?? '',
      salesperson: row.salesperson ?? '',
      commercialPerson: row.commercialPerson ?? '',
      refNo: row.refNo ?? '',
      currency: row.currency,
      incoterm: row.incoterm ?? '',
      portLoading: row.portLoading ?? '',
      portDestination: row.portDestination ?? '',
      remarks: row.notes ?? '',
      status: row.status === 'CANCELLED' ? 'Cancelled' : 'Issued',
      cancelDate: row.cancelDate ?? '',
      total: Number(row.totalAmount),
      lines: (row.items ?? []).map((item: any) => ({
        id: item.id,
        indentItemId: item.indentItemId ?? '',
        itemId: item.itemId ?? '',
        product: item.productName,
        category: item.category ?? '',
        description: item.description ?? '',
        qty: String(item.quantity),
        indentQty: String(item.indentQty ?? item.quantity),
        unit: item.unit ?? '',
        rate: String(item.unitPrice),
        packing: item.packing ?? '',
        manufacturer: item.manufacturer ?? '',
        lineTotal: Number(item.lineTotal),
      })),
      createdById: row.createdById,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private async findOrFail(tx: any, no: string, includeIndent = true) {
    const row = await tx.purchaseOrder.findUnique({
      where: { orderNo: no },
      include: {
        items: true,
        supplierAccount: true,
        supplier: true,
        ...(includeIndent ? { indent: true } : {}),
      },
    });
    if (!row) throw new NotFoundException(`Purchase order '${no}' not found.`);
    return row;
  }

  private async checkOwner(user: any, row: any) {
    await this.access.assertRecordOwnership(user, row.createdById);
  }

  private async whereFor(user: any, query: QueryPurchaseOrderDto) {
    const scopeIds = await this.access.resolveScopeUserIds(user);
    const search = query.search?.trim();
    const from = query.from ? asDate(query.from) : undefined;
    const to = query.to ? asDate(query.to) : undefined;
    return {
      ...(scopeIds ? { createdById: { in: scopeIds } } : {}),
      ...(query.status && query.status !== 'All'
        ? { status: query.status === 'Cancelled' ? 'CANCELLED' as const : { in: issueStatuses } }
        : {}),
      ...(query.indentNo ? { indentNo: query.indentNo } : {}),
      ...(from || to
        ? { orderDate: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } }
        : {}),
      ...(search
        ? {
            OR: [
              { orderNo: { contains: search, mode: 'insensitive' as const } },
              { indentNo: { contains: search, mode: 'insensitive' as const } },
              { supplierName: { contains: search, mode: 'insensitive' as const } },
              { customer: { contains: search, mode: 'insensitive' as const } },
              { salesperson: { contains: search, mode: 'insensitive' as const } },
              { commercialPerson: { contains: search, mode: 'insensitive' as const } },
              { refNo: { contains: search, mode: 'insensitive' as const } },
              { items: { some: { productName: { contains: search, mode: 'insensitive' as const } } } },
            ],
          }
        : {}),
    } satisfies Prisma.PurchaseOrderWhereInput;
  }

  private async nextNumber(tx: any, now = new Date()): Promise<string> {
    const prefix = `302${String(now.getFullYear()).slice(-2)}`;
    const latest = await tx.purchaseOrder.findFirst({
      where: { orderNo: { startsWith: prefix } },
      orderBy: { orderNo: 'desc' },
      select: { orderNo: true },
    });
    const last = latest ? Number(latest.orderNo) : PO_BASE(now.getFullYear());
    return String(Math.max(last, PO_BASE(now.getFullYear())) + 1);
  }

  private async resolveSupplier(tx: any, indent: any) {
    const id = clean(indent.supplierId);
    if (id) {
      const master = await tx.masterAccount.findFirst({
        where: { id, type: 'Supplier', status: 'Active' },
        select: { id: true, name: true },
      });
      if (master) return { supplierAccountId: master.id, supplierId: null, supplierName: master.name };
      const legacy = await tx.supplier.findFirst({
        where: { id, isActive: true },
        select: { id: true, name: true },
      });
      if (legacy) return { supplierAccountId: null, supplierId: legacy.id, supplierName: legacy.name };
    }

    const master = await tx.masterAccount.findFirst({
      where: { type: 'Supplier', status: 'Active', name: { equals: indent.supplier, mode: 'insensitive' } },
      select: { id: true, name: true },
    });
    if (master) return { supplierAccountId: master.id, supplierId: null, supplierName: master.name };
    const legacy = await tx.supplier.findFirst({
      where: { isActive: true, name: { equals: indent.supplier, mode: 'insensitive' } },
      select: { id: true, name: true },
    });
    return legacy
      ? { supplierAccountId: null, supplierId: legacy.id, supplierName: legacy.name }
      : { supplierAccountId: null, supplierId: null, supplierName: indent.supplier };
  }

  private async mapLines(tx: any, indent: any, lines: PurchaseOrderLineDto[]) {
    const used = new Set<string>();
    const mapped = [];
    for (const line of lines) {
      const product = line.product.trim();
      const source = (line.indentItemId
        ? indent.items.find((item: any) => item.id === line.indentItemId)
        : undefined) ?? indent.items.find((item: any) =>
        !used.has(item.id) && item.product.trim().toLocaleLowerCase() === product.toLocaleLowerCase(),
      );
      if (!source) throw new BadRequestException(`Product '${product}' is not part of indent ${indent.no}.`);
      used.add(source.id);
      const indentQty = Number(source.quantity);
      if (Number(line.qty) > indentQty) {
        throw new BadRequestException(`${product}: ordered quantity cannot exceed indent quantity (${indentQty}).`);
      }
      let itemId: string | null = null;
      if (line.itemId) {
        const item = await tx.item.findUnique({ where: { id: line.itemId }, select: { id: true } });
        if (!item) throw new BadRequestException(`Inventory item '${line.itemId}' does not exist.`);
        itemId = item.id;
      } else if (source.productId) {
        const item = await tx.item.findUnique({ where: { id: source.productId }, select: { id: true } });
        itemId = item?.id ?? null;
      }
      const qty = new Prisma.Decimal(line.qty);
      const rate = new Prisma.Decimal(line.rate);
      mapped.push({
        indentItemId: source.id,
        itemId,
        productName: source.product,
        category: clean(source.category),
        description: clean(line.description) ?? source.description,
        indentQty: new Prisma.Decimal(indentQty),
        quantity: qty,
        unit: clean(line.unit) ?? source.unit,
        unitPrice: rate,
        taxRate: null,
        discount: null,
        lineTotal: qty.mul(rate),
        packing: clean(line.packing) ?? source.packing,
        manufacturer: clean(line.manufacturer) ?? source.manufacturer,
      });
    }
    return mapped;
  }

  async options(user: any) {
    await this.access.assertScreenPermission(user, 'Purchase Order', 'view');
    const scopeIds = await this.access.resolveScopeUserIds(user);
    const indents = await this.prisma.indent.findMany({
      where: {
        status: 'Active',
        poStatus: 'PO Pending',
        ...(scopeIds ? { createdBy: { in: scopeIds } } : {}),
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
    const nextPoNo = await this.prisma.$transaction((tx) => this.nextNumber(tx));
    return {
      nextPoNo,
      indents: indents.map((indent) => ({
        no: indent.no,
        date: indent.indentDate,
        supplier: indent.supplier,
        supplierId: indent.supplierId,
        customer: indent.customer,
        salesperson: indent.salesperson ?? '',
        commercialPerson: indent.commercialPerson ?? '',
        refNo: indent.refNo ?? '',
        currency: indent.currency,
        incoterm: indent.incoterm ?? '',
        portLoading: indent.portLoading ?? '',
        portDestination: indent.portDestination ?? '',
        lines: indent.items.map((line) => ({
          id: line.id,
          productId: line.productId ?? '',
          product: line.product,
          category: line.category ?? '',
          description: line.description ?? '',
          qty: String(line.quantity),
          unit: line.unit,
          rate: String(line.rate),
          packing: line.packing ?? '',
          manufacturer: line.manufacturer ?? '',
        })),
      })),
    };
  }

  async list(user: any, query: QueryPurchaseOrderDto) {
    await this.access.assertScreenPermission(user, 'Purchase Order', 'view');
    const where = await this.whereFor(user, query);
    const rows = await this.prisma.purchaseOrder.findMany({
      where,
      include: { items: true, indent: true, supplier: true, supplierAccount: true },
      orderBy: [{ orderDate: 'desc' }, { orderNo: 'desc' }],
    });
    return rows.map((row) => this.format(row));
  }

  async report(user: any, query: QueryPurchaseOrderDto) {
    await this.access.assertScreenPermission(user, 'PO Report', 'view');
    const where = await this.whereFor(user, query);
    const rows = await this.prisma.purchaseOrder.findMany({
      where,
      include: { items: true, indent: true, supplier: true, supplierAccount: true },
      orderBy: [{ orderDate: 'desc' }, { orderNo: 'desc' }],
    });
    const formatted = rows.map((row) => this.format(row));
    return {
      total: formatted.length,
      issued: formatted.filter((row) => row.status === 'Issued').length,
      cancelled: formatted.filter((row) => row.status === 'Cancelled').length,
      amount: formatted.reduce((sum, row) => sum + row.total, 0),
      rows: formatted,
    };
  }

  async get(user: any, no: string) {
    await this.access.assertScreenPermission(user, 'Purchase Order', 'view');
    const row = await this.findOrFail(this.prisma, no);
    await this.checkOwner(user, row);
    return this.format(row);
  }

  async create(user: any, dto: CreatePurchaseOrderDto) {
    await this.access.assertScreenPermission(user, 'Purchase Order', 'create');
    try {
      const row = await this.prisma.$transaction(async (tx) => {
        const indent = await tx.indent.findUnique({
          where: { no: dto.indentNo },
          include: { items: true },
        });
        if (!indent) throw new NotFoundException(`Indent '${dto.indentNo}' not found.`);
        await this.access.assertRecordOwnership(user, indent.createdBy);
        if (indent.status !== 'Active' || indent.poStatus !== 'PO Pending') {
          throw new ConflictException(`Indent '${indent.no}' is not available for a purchase order.`);
        }
        if (indent.shipStatus !== 'Not Shipped') {
          throw new ConflictException(`Indent '${indent.no}' already has shipments.`);
        }
        const supplier = await this.resolveSupplier(tx, indent);
        const items = await this.mapLines(tx, indent, dto.lines);
        const total = items.reduce((sum, item) => sum.add(item.lineTotal), new Prisma.Decimal(0));
        const orderNo = await this.nextNumber(tx, asDate(dto.date));
        const created = await tx.purchaseOrder.create({
          data: {
            orderNo,
            ...supplier,
            indentNo: indent.no,
            orderDate: asDate(dto.date),
            expectedDate: dto.deliveryDate ? asDate(dto.deliveryDate) : null,
            status: 'SENT',
            currency: clean(dto.currency) ?? indent.currency,
            totalAmount: total,
            customer: indent.customer,
            salesperson: clean(dto.salesperson) ?? indent.salesperson,
            commercialPerson: clean(dto.commercialPerson) ?? indent.commercialPerson,
            refNo: clean(dto.refNo) ?? indent.refNo,
            incoterm: clean(dto.incoterm) ?? indent.incoterm,
            portLoading: clean(dto.portLoading) ?? indent.portLoading,
            portDestination: clean(dto.portDestination) ?? indent.portDestination,
            notes: clean(dto.remarks),
            createdById: user.id,
            items: { create: items },
          },
          include: { items: true, indent: true, supplier: true, supplierAccount: true },
        });
        await tx.indent.update({ where: { id: indent.id }, data: { poStatus: 'PO Issued' } });
        return created;
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.format(row);
    } catch (error: any) {
      if (error?.code === 'P2002' || error?.code === 'P2034') {
        throw new ConflictException('A purchase order was created for this indent at the same time. Refresh and try again.');
      }
      throw error;
    }
  }

  async update(user: any, no: string, dto: UpdatePurchaseOrderDto) {
    await this.access.assertScreenPermission(user, 'Purchase Order', 'edit');
    const current = await this.findOrFail(this.prisma, no);
    await this.checkOwner(user, current);
    if (current.status === 'CANCELLED') throw new ConflictException('Cancelled purchase orders are read-only.');
    if (current.indent?.shipStatus !== 'Not Shipped') throw new ConflictException('Purchase orders cannot be edited after shipment starts.');
    if ((await this.prisma.goodsReceipt.count({ where: { purchaseOrderId: current.id } })) > 0) {
      throw new ConflictException('Purchase orders cannot be edited after goods have been received.');
    }
    if (!current.indentNo) throw new ConflictException('This order is not linked to an indent.');

    const updated = await this.prisma.$transaction(async (tx) => {
      const data: Prisma.PurchaseOrderUpdateInput = {
        ...(dto.date !== undefined ? { orderDate: asDate(dto.date) } : {}),
        ...(dto.deliveryDate !== undefined ? { expectedDate: asDate(dto.deliveryDate) } : {}),
        ...(dto.salesperson !== undefined ? { salesperson: clean(dto.salesperson) } : {}),
        ...(dto.commercialPerson !== undefined ? { commercialPerson: clean(dto.commercialPerson) } : {}),
        ...(dto.refNo !== undefined ? { refNo: clean(dto.refNo) } : {}),
        ...(dto.currency !== undefined ? { currency: dto.currency } : {}),
        ...(dto.incoterm !== undefined ? { incoterm: clean(dto.incoterm) } : {}),
        ...(dto.portLoading !== undefined ? { portLoading: clean(dto.portLoading) } : {}),
        ...(dto.portDestination !== undefined ? { portDestination: clean(dto.portDestination) } : {}),
        ...(dto.remarks !== undefined ? { notes: clean(dto.remarks) } : {}),
      };
      if (dto.lines) {
        const indent = await tx.indent.findUnique({ where: { no: current.indentNo! }, include: { items: true } });
        if (!indent) throw new NotFoundException(`Indent '${current.indentNo}' not found.`);
        const items = await this.mapLines(tx, indent, dto.lines);
        const total = items.reduce((sum, item) => sum.add(item.lineTotal), new Prisma.Decimal(0));
        await tx.purchaseOrderItem.deleteMany({ where: { purchaseOrderId: current.id } });
        data.totalAmount = total;
        data.items = { create: items };
      }
      return tx.purchaseOrder.update({
        where: { id: current.id },
        data,
        include: { items: true, indent: true, supplier: true, supplierAccount: true },
      });
    });
    return this.format(updated);
  }

  private async ensureCanRelease(tx: any, row: any) {
    if (row.indent?.shipStatus && row.indent.shipStatus !== 'Not Shipped') {
      throw new ConflictException(`Indent '${row.indentNo}' already has shipments and its purchase order cannot be cancelled or deleted.`);
    }
    const [receipts, invoices] = await Promise.all([
      tx.goodsReceipt.count({ where: { purchaseOrderId: row.id } }),
      tx.supplierInvoice.count({ where: { purchaseOrderId: row.id } }),
    ]);
    if (receipts || invoices) {
      throw new ConflictException('This purchase order cannot be cancelled or deleted after goods receipts or supplier invoices exist.');
    }
  }

  async cancel(user: any, no: string) {
    await this.access.assertScreenPermission(user, 'Purchase Order', 'edit');
    const current = await this.findOrFail(this.prisma, no);
    await this.checkOwner(user, current);
    if (current.status === 'CANCELLED') return this.format(current);
    await this.ensureCanRelease(this.prisma, current);
    const cancelled = await this.prisma.$transaction(async (tx) => {
      const row = await tx.purchaseOrder.update({
        where: { id: current.id },
        data: { status: 'CANCELLED', cancelDate: new Date().toISOString().slice(0, 10) },
        include: { items: true, indent: true, supplier: true, supplierAccount: true },
      });
      if (current.indentNo) await tx.indent.update({ where: { no: current.indentNo }, data: { poStatus: 'PO Pending' } });
      return row;
    });
    return this.format(cancelled);
  }

  async remove(user: any, no: string) {
    await this.access.assertScreenPermission(user, 'Purchase Order', 'delete');
    const current = await this.findOrFail(this.prisma, no);
    await this.checkOwner(user, current);
    await this.ensureCanRelease(this.prisma, current);
    await this.prisma.$transaction(async (tx) => {
      await tx.purchaseOrder.delete({ where: { id: current.id } });
      if (current.indentNo) await tx.indent.update({ where: { no: current.indentNo }, data: { poStatus: 'PO Pending' } });
    });
    return { ok: true, orderNo: current.orderNo };
  }
}
