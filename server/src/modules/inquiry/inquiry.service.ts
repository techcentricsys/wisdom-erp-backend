import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CustomerInquiryStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import {
  CreateInquiryDto,
  InquiryItemDto,
  UpdateInquiryDto,
  UpdateSupplierRateSheetDto,
} from './dto/inquiry.dto.js';

const inquiryInclude = {
  customer: { select: { id: true, code: true, name: true } },
  salesperson: { select: { id: true, firstName: true, lastName: true, email: true } },
  commercialPerson: { select: { id: true, firstName: true, lastName: true, email: true } },
  salespersonMaster: { select: { id: true, name: true, status: true } },
  commercialPersonMaster: { select: { id: true, name: true, status: true } },
  items: {
    include: {
      product: { select: { id: true, sku: true, name: true, uom: true } },
      rateSheets: { include: { supplier: { select: { id: true, code: true, name: true } } } },
    },
  },
} satisfies Prisma.CustomerInquiryInclude;

@Injectable()
export class InquiryService {
  constructor(private readonly prisma: PrismaService) {}

  async list(actorId: string, filters: { status?: string; search?: string }) {
    const where: Prisma.CustomerInquiryWhereInput = await this.scopeWhere(actorId);
    if (filters.status && filters.status.toUpperCase() !== 'ALL') {
      const status = filters.status.toUpperCase();
      if (!Object.values(CustomerInquiryStatus).includes(status as CustomerInquiryStatus)) {
        throw new BadRequestException('Status must be OPEN, OFFERED, CANCELLED, or ALL.');
      }
      where.status = status as CustomerInquiryStatus;
    }
    const search = filters.search?.trim();
    if (search) {
      where.OR = [
        { inquiryNo: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { items: { some: { product: { name: { contains: search, mode: 'insensitive' } } } } },
      ];
    }
    return this.prisma.customerInquiry.findMany({ where, include: inquiryInclude, orderBy: [{ inquiryDate: 'desc' }, { inquiryNo: 'desc' }] });
  }

  async findOne(actorId: string, inquiryNo: string) {
    const where = await this.scopeWhere(actorId);
    const inquiry = await this.prisma.customerInquiry.findFirst({
      where: { AND: [where, { inquiryNo }] },
      include: inquiryInclude,
    });
    if (!inquiry) throw new NotFoundException('Inquiry not found.');
    return inquiry;
  }

  async create(actorId: string, dto: CreateInquiryDto) {
    const actor = await this.prisma.user.findUnique({ where: { id: actorId }, select: { id: true, companyId: true } });
    if (!actor) throw new NotFoundException('Authenticated user not found.');
    await this.validateHeaderReferences(dto, actor.companyId);
    await this.validateItems(dto.items);

    return this.prisma.$transaction(async (tx) => {
      // Serialize number allocation so two simultaneous requests cannot claim the same inquiry number.
      // The lock function returns PostgreSQL `void`; cast it to text so Prisma
      // can deserialize the result while keeping the lock inside this transaction.
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(1022600000)::text AS locked`;
      const inquiryNo = await this.nextInquiryNo(tx, dto.inquiryDate ? new Date(dto.inquiryDate) : new Date());
      return tx.customerInquiry.create({
        data: {
          inquiryNo,
          inquiryDate: dto.inquiryDate ? new Date(dto.inquiryDate) : new Date(),
          customerId: dto.customerId.trim(),
          salespersonId: dto.salespersonMasterId ? null : dto.salespersonId?.trim() || null,
          commercialPersonId: dto.commercialPersonMasterId ? null : dto.commercialPersonId?.trim() || null,
          salespersonMasterId: dto.salespersonMasterId?.trim() || null,
          commercialPersonMasterId: dto.commercialPersonMasterId?.trim() || null,
          incoterm: dto.incoterm?.trim() || null,
          currency: dto.currency?.trim().toUpperCase() || 'USD',
          portLoading: dto.portLoading?.trim() || null,
          portDestination: dto.portDestination?.trim() || null,
          remarks: dto.remarks?.trim() || null,
          createdById: actorId,
          items: { create: this.itemData(dto.items) },
        },
        include: inquiryInclude,
      });
    });
  }

  async update(actorId: string, inquiryNo: string, dto: UpdateInquiryDto) {
    const existing = await this.findOne(actorId, inquiryNo);
    if (existing.status === CustomerInquiryStatus.CANCELLED) {
      throw new ConflictException('A cancelled inquiry cannot be edited.');
    }
    const actor = await this.prisma.user.findUnique({ where: { id: actorId }, select: { companyId: true } });
    if (dto.customerId || dto.salespersonId !== undefined || dto.commercialPersonId !== undefined || dto.salespersonMasterId !== undefined || dto.commercialPersonMasterId !== undefined) {
      await this.validateHeaderReferences(dto, actor?.companyId ?? null);
    }
    if (dto.items) await this.validateItems(dto.items);

    const data: Prisma.CustomerInquiryUpdateInput = {};
    if (dto.inquiryDate) data.inquiryDate = new Date(dto.inquiryDate);
    if (dto.customerId) data.customer = { connect: { id: dto.customerId.trim() } };
    if (dto.salespersonId !== undefined || dto.salespersonMasterId !== undefined) {
      data.salesperson = dto.salespersonMasterId ? { disconnect: true } : dto.salespersonId ? { connect: { id: dto.salespersonId.trim() } } : { disconnect: true };
      data.salespersonMaster = dto.salespersonMasterId ? { connect: { id: dto.salespersonMasterId.trim() } } : { disconnect: true };
    }
    if (dto.commercialPersonId !== undefined || dto.commercialPersonMasterId !== undefined) {
      data.commercialPerson = dto.commercialPersonMasterId ? { disconnect: true } : dto.commercialPersonId ? { connect: { id: dto.commercialPersonId.trim() } } : { disconnect: true };
      data.commercialPersonMaster = dto.commercialPersonMasterId ? { connect: { id: dto.commercialPersonMasterId.trim() } } : { disconnect: true };
    }
    if (dto.incoterm !== undefined) data.incoterm = dto.incoterm.trim() || null;
    if (dto.currency !== undefined) data.currency = dto.currency.trim().toUpperCase();
    if (dto.portLoading !== undefined) data.portLoading = dto.portLoading.trim() || null;
    if (dto.portDestination !== undefined) data.portDestination = dto.portDestination.trim() || null;
    if (dto.remarks !== undefined) data.remarks = dto.remarks.trim() || null;
    if (dto.items) data.items = { deleteMany: {}, create: this.itemData(dto.items) };

    try {
      return await this.prisma.customerInquiry.update({ where: { inquiryNo }, data, include: inquiryInclude });
    } catch (error) {
      this.throwReferenceError(error);
    }
  }

  async cancel(actorId: string, inquiryNo: string, cancelReason: string) {
    const reason = typeof cancelReason === 'string' ? cancelReason.trim() : '';
    if (!reason) throw new BadRequestException('A cancellation reason is required.');
    const inquiry = await this.findOne(actorId, inquiryNo);
    if (inquiry.status === CustomerInquiryStatus.CANCELLED) throw new ConflictException('Inquiry is already cancelled.');
    return this.prisma.customerInquiry.update({
      where: { inquiryNo },
      data: { status: CustomerInquiryStatus.CANCELLED, cancelDate: new Date(), cancelReason: reason },
      include: inquiryInclude,
    });
  }

  async delete(actorId: string, inquiryNo: string) {
    await this.findOne(actorId, inquiryNo);
    await this.prisma.customerInquiry.delete({ where: { inquiryNo } });
    return { success: true };
  }

  async options(actorId: string) {
    const actor = await this.prisma.user.findUnique({
      where: { id: actorId },
      select: { companyId: true, userRoles: { select: { role: { select: { name: true } } } } },
    });
    if (!actor) throw new NotFoundException('Authenticated user not found.');
    const [customers, products, suppliers, users] = await Promise.all([
      this.prisma.customer.findMany({ where: { isActive: true }, select: { id: true, code: true, name: true, email: true, phone: true, city: true, country: true, contactName: true }, orderBy: { name: 'asc' } }),
      this.prisma.item.findMany({ where: { isActive: true }, select: { id: true, sku: true, name: true, description: true, uom: true }, orderBy: { name: 'asc' } }),
      this.prisma.supplier.findMany({ where: { isActive: true }, select: { id: true, code: true, name: true, email: true, phone: true, city: true, country: true, contactName: true }, orderBy: { name: 'asc' } }),
      this.prisma.user.findMany({
        where: actor.companyId ? { companyId: actor.companyId, status: 'ACTIVE' } : { id: actorId, status: 'ACTIVE' },
        select: { id: true, firstName: true, lastName: true, email: true, userRoles: { select: { role: { select: { name: true } } } } },
        orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
      }),
    ]);
    return { customers, products, suppliers, users };
  }

  // Master screens currently create Customer and Product records locally in
  // the frontend. These small endpoints let those screens persist the fields
  // required by Inquiry's foreign keys until dedicated master modules exist.
  async createCustomer(payload: { code?: string; name?: string; category?: string; email?: string; phone?: string; city?: string; country?: string }) {
    const name = payload.name?.trim();
    if (!name) throw new BadRequestException('Customer name is required.');
    const code = payload.code?.trim() || `CUS-${Date.now()}`;
    try {
      return await this.prisma.customer.create({ data: { code, name, email: payload.email?.trim() || null, phone: payload.phone?.trim() || null, city: payload.city?.trim() || null, country: payload.country?.trim() || null } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ConflictException('A customer with this code already exists.');
      throw error;
    }
  }

  async updateCustomer(id: string, payload: { name?: string; email?: string; phone?: string; city?: string; country?: string }) {
    const name = payload.name?.trim();
    if (payload.name !== undefined && !name) throw new BadRequestException('Customer name is required.');
    try {
      return await this.prisma.customer.update({ where: { id }, data: { ...(name ? { name } : {}), ...(payload.email !== undefined ? { email: payload.email.trim() || null } : {}), ...(payload.phone !== undefined ? { phone: payload.phone.trim() || null } : {}), ...(payload.city !== undefined ? { city: payload.city.trim() || null } : {}), ...(payload.country !== undefined ? { country: payload.country.trim() || null } : {}) } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') throw new NotFoundException('Customer not found.');
      throw error;
    }
  }

  async deleteCustomer(id: string) {
    const result = await this.prisma.customer.updateMany({ where: { id }, data: { isActive: false } });
    if (!result.count) throw new NotFoundException('Customer not found.');
    return { success: true };
  }

  async createSupplier(payload: { code?: string; name?: string; email?: string; phone?: string; city?: string; country?: string; paymentTerms?: string; taxNumber?: string }) {
    const name = payload.name?.trim();
    if (!name) throw new BadRequestException('Supplier name is required.');
    const code = payload.code?.trim() || `SUP-${Date.now()}`;
    try {
      return await this.prisma.supplier.create({ data: { code, name, email: payload.email?.trim() || null, phone: payload.phone?.trim() || null, city: payload.city?.trim() || null, country: payload.country?.trim() || null, paymentTerms: payload.paymentTerms?.trim() || null, taxNumber: payload.taxNumber?.trim() || null } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ConflictException('A supplier with this code already exists.');
      throw error;
    }
  }

  async updateSupplier(id: string, payload: { name?: string; email?: string; phone?: string; city?: string; country?: string; paymentTerms?: string; taxNumber?: string }) {
    const name = payload.name?.trim();
    if (payload.name !== undefined && !name) throw new BadRequestException('Supplier name is required.');
    try {
      return await this.prisma.supplier.update({ where: { id }, data: { ...(name ? { name } : {}), ...(payload.email !== undefined ? { email: payload.email.trim() || null } : {}), ...(payload.phone !== undefined ? { phone: payload.phone.trim() || null } : {}), ...(payload.city !== undefined ? { city: payload.city.trim() || null } : {}), ...(payload.country !== undefined ? { country: payload.country.trim() || null } : {}), ...(payload.paymentTerms !== undefined ? { paymentTerms: payload.paymentTerms.trim() || null } : {}), ...(payload.taxNumber !== undefined ? { taxNumber: payload.taxNumber.trim() || null } : {}) } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') throw new NotFoundException('Supplier not found.');
      throw error;
    }
  }

  async deleteSupplier(id: string) {
    const result = await this.prisma.supplier.updateMany({ where: { id }, data: { isActive: false } });
    if (!result.count) throw new NotFoundException('Supplier not found.');
    return { success: true };
  }

  async createProduct(payload: { sku?: string; name?: string; description?: string; uom?: string }) {
    const name = payload.name?.trim();
    if (!name) throw new BadRequestException('Product name is required.');
    const sku = payload.sku?.trim() || `SKU-${Date.now()}`;
    try {
      return await this.prisma.item.create({ data: { sku, name, description: payload.description?.trim() || null, uom: payload.uom?.trim() || 'EA' } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ConflictException('A product with this SKU already exists.');
      throw error;
    }
  }

  async updateProduct(id: string, payload: { name?: string; description?: string; uom?: string }) {
    const name = payload.name?.trim();
    if (payload.name !== undefined && !name) throw new BadRequestException('Product name is required.');
    try {
      return await this.prisma.item.update({ where: { id }, data: { ...(name ? { name } : {}), ...(payload.description !== undefined ? { description: payload.description.trim() || null } : {}), ...(payload.uom !== undefined ? { uom: payload.uom.trim() || 'EA' } : {}) } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') throw new NotFoundException('Product not found.');
      throw error;
    }
  }

  async deleteProduct(id: string) {
    const result = await this.prisma.item.updateMany({ where: { id }, data: { isActive: false } });
    if (!result.count) throw new NotFoundException('Product not found.');
    return { success: true };
  }

  async listRateSheets(actorId: string, inquiryNo: string) {
    await this.findOne(actorId, inquiryNo);
    return this.prisma.supplierRateSheet.findMany({
      where: { inquiryNo },
      include: {
        supplier: { select: { id: true, code: true, name: true } },
        inquiryItem: { include: { product: { select: { id: true, sku: true, name: true, uom: true } } } },
      },
      orderBy: [{ inquiryItemId: 'asc' }, { quotedRate: 'asc' }],
    });
  }

  async addRateSheet(actorId: string, inquiryNo: string, dto: { inquiryItemId: string; supplierId: string; quotedRate: number; commissionPct?: number; isSelected?: boolean }) {
    await this.findOne(actorId, inquiryNo);
    if ((dto.commissionPct ?? 0) > 100) throw new BadRequestException('Commission percentage cannot exceed 100.');
    const [item, supplier] = await Promise.all([
      this.prisma.inquiryItem.findFirst({ where: { id: dto.inquiryItemId, inquiryNo }, select: { id: true } }),
      this.prisma.supplier.findFirst({ where: { id: dto.supplierId, isActive: true }, select: { id: true } }),
    ]);
    if (!item) throw new NotFoundException('Inquiry line item not found.');
    if (!supplier) throw new NotFoundException('Active supplier not found.');
    try {
      return await this.prisma.$transaction(async (tx) => {
        if (dto.isSelected) await tx.supplierRateSheet.updateMany({ where: { inquiryItemId: item.id }, data: { isSelected: false } });
        return tx.supplierRateSheet.create({
          data: {
            inquiryNo,
            inquiryItemId: item.id,
            supplierId: supplier.id,
            quotedRate: new Prisma.Decimal(dto.quotedRate),
            commissionPct: new Prisma.Decimal(dto.commissionPct ?? 0),
            isSelected: dto.isSelected ?? false,
          },
          include: { supplier: { select: { id: true, code: true, name: true } } },
        });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A rate already exists for this supplier and inquiry item.');
      }
      throw error;
    }
  }

  async updateRateSheet(actorId: string, id: string, dto: UpdateSupplierRateSheetDto) {
    const current = await this.prisma.supplierRateSheet.findUnique({ where: { id }, select: { id: true, inquiryNo: true, inquiryItemId: true } });
    if (!current) throw new NotFoundException('Supplier rate sheet not found.');
    await this.findOne(actorId, current.inquiryNo);
    if (dto.commissionPct !== undefined && dto.commissionPct > 100) throw new BadRequestException('Commission percentage cannot exceed 100.');
    return this.prisma.$transaction(async (tx) => {
      if (dto.isSelected) await tx.supplierRateSheet.updateMany({ where: { inquiryItemId: current.inquiryItemId, id: { not: id } }, data: { isSelected: false } });
      return tx.supplierRateSheet.update({
        where: { id },
        data: {
          ...(dto.quotedRate !== undefined ? { quotedRate: new Prisma.Decimal(dto.quotedRate) } : {}),
          ...(dto.commissionPct !== undefined ? { commissionPct: new Prisma.Decimal(dto.commissionPct) } : {}),
          ...(dto.isSelected !== undefined ? { isSelected: dto.isSelected } : {}),
        },
        include: { supplier: { select: { id: true, code: true, name: true } } },
      });
    });
  }

  async deleteRateSheet(actorId: string, id: string) {
    const rate = await this.prisma.supplierRateSheet.findUnique({ where: { id }, select: { id: true, inquiryNo: true } });
    if (!rate) throw new NotFoundException('Supplier rate sheet not found.');
    await this.findOne(actorId, rate.inquiryNo);
    await this.prisma.supplierRateSheet.delete({ where: { id } });
    return { success: true };
  }

  private async scopeWhere(actorId: string): Promise<Prisma.CustomerInquiryWhereInput> {
    const actor = await this.prisma.user.findUnique({
      where: { id: actorId },
      select: { companyId: true, userRoles: { select: { role: { select: { name: true } } } } },
    });
    if (!actor) throw new NotFoundException('Authenticated user not found.');
    const broadScope = actor.userRoles.some(({ role }) => ['ADMIN', 'MANAGER'].includes(role.name.toUpperCase()));
    if (broadScope && actor.companyId) return { createdBy: { companyId: actor.companyId } };
    return { createdById: actorId };
  }

  private async validateHeaderReferences(dto: Partial<CreateInquiryDto | UpdateInquiryDto>, companyId: string | null) {
    if (dto.customerId) {
      const customer = await this.prisma.customer.findFirst({ where: { id: dto.customerId.trim(), isActive: true }, select: { id: true } });
      if (!customer) throw new NotFoundException('Active customer not found.');
    }
    const userIds = [dto.salespersonId, dto.commercialPersonId].filter((id): id is string => typeof id === 'string' && Boolean(id.trim())).map((id) => id.trim());
    if (userIds.length) {
      const users = await this.prisma.user.findMany({
        where: { id: { in: [...new Set(userIds)] }, status: 'ACTIVE', ...(companyId ? { companyId } : {}) },
        select: { id: true },
      });
      if (users.length !== new Set(userIds).size) throw new NotFoundException('One or more assigned users are not active in this company.');
    }
    const masterReferences = [
      { id: dto.salespersonMasterId, kind: 'salesperson' },
      { id: dto.commercialPersonMasterId, kind: 'commercialPerson' },
    ].filter((reference): reference is { id: string; kind: string } => typeof reference.id === 'string' && Boolean(reference.id.trim()));
    for (const reference of masterReferences) {
      const master = await this.prisma.setupMasterItem.findFirst({
        where: { id: reference.id.trim(), kind: reference.kind },
        select: { id: true },
      });
      if (!master) throw new NotFoundException(`The selected ${reference.kind === 'salesperson' ? 'salesperson' : 'commercial person'} master was not found.`);
    }
  }

  private async validateItems(items: InquiryItemDto[]) {
    if (!Array.isArray(items) || items.length === 0) throw new BadRequestException('Add at least one inquiry item.');
    const ids = [...new Set(items.map((item) => item.productId.trim()))];
    const products = await this.prisma.item.count({ where: { id: { in: ids }, isActive: true } });
    if (products !== ids.length) throw new NotFoundException('One or more active products were not found.');
    if (items.some((item) => !item.unit.trim())) throw new BadRequestException('Every inquiry item must have a unit.');
  }

  private itemData(items: InquiryItemDto[]): Prisma.InquiryItemCreateWithoutInquiryInput[] {
    return items.map((item) => ({
      product: { connect: { id: item.productId.trim() } },
      quantity: new Prisma.Decimal(item.quantity),
      unit: item.unit.trim(),
      shippingMode: item.shippingMode?.trim() || null,
      paymentTerm: item.paymentTerm?.trim() || null,
      manufacturer: item.manufacturer?.trim() || null,
      description: item.description?.trim() || null,
      shipmentSchedule: item.shipmentSchedule?.trim() || null,
      packing: item.packing?.trim() || null,
      detail: item.detail?.trim() || null,
    }));
  }

  private async nextInquiryNo(tx: Prisma.TransactionClient, date: Date) {
    const prefix = `102${String(date.getFullYear()).slice(-2)}`;
    const last = await tx.customerInquiry.findFirst({ where: { inquiryNo: { startsWith: prefix } }, orderBy: { inquiryNo: 'desc' }, select: { inquiryNo: true } });
    const next = (last ? Number(last.inquiryNo.slice(prefix.length)) : 0) + 1;
    if (next > 99_999) throw new ConflictException('Inquiry number limit reached for this year.');
    return `${prefix}${String(next).padStart(5, '0')}`;
  }

  private throwReferenceError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      throw new BadRequestException('A referenced customer, user, or product no longer exists.');
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundException('Inquiry or referenced record not found.');
    }
    throw error;
  }
}
