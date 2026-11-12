import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import {
  AccountType,
  AssignCustomerDto,
  BankDetailDto,
  CreateMasterAccountDto,
  QueryMasterAccountDto,
  UpdateMasterAccountDto,
} from './dto.js';
import { MasterAccountsAccess } from './master-accounts.access.js';

const CODE_PREFIX: Record<AccountType, string> = {
  Supplier: 'SUP',
  Customer: 'CUS',
  'Shipping Agent': 'SHA',
  Manufacturer: 'MFG',
  Bank: 'BNK',
  Salesperson: 'SLP',
  'Commercial Person': 'CMP',
  'Account Category': 'CAT',
};

const clean = (val?: string) => {
  if (val === undefined) return undefined;
  const trimmed = val.trim();
  return trimmed.length ? trimmed : null;
};

@Injectable()
export class MasterAccountsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: MasterAccountsAccess,
  ) {}

  private async generateCode(type: AccountType, customCode?: string): Promise<string> {
    if (customCode?.trim()) {
      const code = customCode.trim().toUpperCase();
      const exists = await this.prisma.masterAccount.findUnique({ where: { code } });
      if (exists) throw new ConflictException(`Account code '${code}' already exists.`);
      return code;
    }

    const prefix = CODE_PREFIX[type] ?? 'ACC';
    const latest = await this.prisma.masterAccount.findFirst({
      where: { code: { startsWith: `${prefix}-` } },
      orderBy: { code: 'desc' },
      select: { code: true },
    });

    const lastNum = latest ? parseInt(latest.code.split('-')[1] ?? '0', 10) || 0 : 0;
    return `${prefix}-${String(lastNum + 1).padStart(4, '0')}`;
  }

  private async ensureUniqueName(type: string, name: string, excludeId?: string) {
    const duplicate = await this.prisma.masterAccount.findFirst({
      where: {
        type,
        name: { equals: name, mode: 'insensitive' },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (duplicate) {
      throw new ConflictException(`${type} '${name}' already exists.`);
    }
  }

  private mapBankDetails(banks?: BankDetailDto[]) {
    return (banks ?? []).map((b, idx) => ({
      bankType: b.bankType ?? (idx === 0 ? 'PRIMARY' : 'INTERMEDIATE'),
      bankName: b.bankName.trim(),
      branch: clean(b.branch) ?? null,
      accountNo: clean(b.accountNo) ?? null,
      accountTitle: clean(b.accountTitle) ?? null,
      address: clean(b.address) ?? null,
      country: clean(b.country) ?? null,
      city: clean(b.city) ?? null,
      postCode: clean(b.postCode) ?? null,
      swiftCode: clean(b.swiftCode)?.toUpperCase() ?? null,
      iban: clean(b.iban)?.toUpperCase() ?? null,
    }));
  }

  async list(user: any, query: QueryMasterAccountDto) {
    const screen = query.type ?? 'Account List';
    await this.access.assertScreenPermission(user, screen, 'view');

    const scopeIds = await this.access.resolveScopeUserIds(user);
    const q = query.search?.trim();

    const where: Prisma.MasterAccountWhereInput = {
      ...(scopeIds ? { createdBy: { in: scopeIds } } : {}),
      ...(query.type ? { type: query.type } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.category ? { category: query.category } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { code: { contains: q, mode: 'insensitive' } },
              { category: { contains: q, mode: 'insensitive' } },
              { tag: { contains: q, mode: 'insensitive' } },
              { email: { contains: q, mode: 'insensitive' } },
              { phone: { contains: q, mode: 'insensitive' } },
              { city: { contains: q, mode: 'insensitive' } },
              { originCountry: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    return this.prisma.masterAccount.findMany({
      where,
      include: { bankDetails: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAccountList(user: any, query: QueryMasterAccountDto) {
    await this.access.assertScreenPermission(user, 'Account List', 'view');

    const scopeIds = await this.access.resolveScopeUserIds(user);
    const allowedTypes =
      query.type && ['Supplier', 'Customer'].includes(query.type)
        ? [query.type]
        : ['Supplier', 'Customer'];

    const q = query.search?.trim();

    const baseWhere: Prisma.MasterAccountWhereInput = {
      ...(scopeIds ? { createdBy: { in: scopeIds } } : {}),
      type: { in: ['Supplier', 'Customer'] },
    };

    const allParties = await this.prisma.masterAccount.findMany({
      where: baseWhere,
      select: { type: true },
    });

    const suppliersCount = allParties.filter((a) => a.type === 'Supplier').length;
    const customersCount = allParties.filter((a) => a.type === 'Customer').length;

    const items = await this.prisma.masterAccount.findMany({
      where: {
        ...baseWhere,
        type: { in: allowedTypes },
        ...(query.status ? { status: query.status } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { code: { contains: q, mode: 'insensitive' } },
                { category: { contains: q, mode: 'insensitive' } },
                { tag: { contains: q, mode: 'insensitive' } },
                { city: { contains: q, mode: 'insensitive' } },
                { originCountry: { contains: q, mode: 'insensitive' } },
                { phone: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: { bankDetails: true },
      orderBy: { createdAt: 'desc' },
    });

    return {
      stats: {
        total: suppliersCount + customersCount,
        suppliers: suppliersCount,
        customers: customersCount,
      },
      items,
    };
  }

  async getById(user: any, id: string) {
    const account = await this.prisma.masterAccount.findUnique({
      where: { id },
      include: { bankDetails: true },
    });

    if (!account) throw new NotFoundException('Account not found.');

    await this.access.assertScreenPermission(user, account.type, 'view');
    await this.access.assertRecordOwnership(user, account.createdBy);

    return account;
  }

  async create(user: any, dto: CreateMasterAccountDto) {
    await this.access.assertScreenPermission(user, dto.type, 'create');

    const name = dto.name.trim();
    await this.ensureUniqueName(dto.type, name);
    const code = await this.generateCode(dto.type, dto.code);
    const bankRows = this.mapBankDetails(dto.bankDetails);

    return this.prisma.masterAccount.create({
      data: {
        code,
        name,
        type: dto.type,
        category: clean(dto.category) ?? null,
        tag: clean(dto.tag) ?? null,
        description: clean(dto.description) ?? null,
        email: clean(dto.email)?.toLowerCase() ?? null,
        phone: clean(dto.phone) ?? null,
        mobile: clean(dto.mobile) ?? null,
        website: clean(dto.website) ?? null,
        taxId: clean(dto.taxId) ?? null,
        address: clean(dto.address) ?? null,
        city: clean(dto.city) ?? null,
        postCode: clean(dto.postCode) ?? null,
        originCountry: clean(dto.originCountry) ?? null,
        factoryAddress: clean(dto.factoryAddress) ?? null,
        factoryCity: clean(dto.factoryCity) ?? null,
        factoryPostCode: clean(dto.factoryPostCode) ?? null,
        factoryCountry: clean(dto.factoryCountry) ?? null,
        status: dto.status ?? 'Active',
        salesperson: clean(dto.salesperson) ?? null,
        commercialPerson: clean(dto.commercialPerson) ?? null,
        contacts: dto.contacts ? (dto.contacts as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
        createdBy: user.id,
        ...(bankRows.length ? { bankDetails: { create: bankRows } } : {}),
      },
      include: { bankDetails: true },
    });
  }

  async update(user: any, id: string, dto: UpdateMasterAccountDto) {
    const existing = await this.prisma.masterAccount.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Account not found.');

    await this.access.assertScreenPermission(user, existing.type, 'edit');
    await this.access.assertRecordOwnership(user, existing.createdBy);

    let nextName = existing.name;
    if (dto.name !== undefined) {
      nextName = dto.name.trim();
      if (nextName.toLowerCase() !== existing.name.toLowerCase()) {
        await this.ensureUniqueName(existing.type, nextName, id);
      }
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.bankDetails !== undefined) {
        await tx.bankDetail.deleteMany({ where: { accountId: id } });
        const bankRows = this.mapBankDetails(dto.bankDetails);
        if (bankRows.length) {
          await tx.bankDetail.createMany({
            data: bankRows.map((b) => ({ ...b, accountId: id })),
          });
        }
      }

      return tx.masterAccount.update({
        where: { id },
        data: {
          name: nextName,
          category: clean(dto.category),
          tag: clean(dto.tag),
          description: clean(dto.description),
          email: clean(dto.email)?.toLowerCase(),
          phone: clean(dto.phone),
          mobile: clean(dto.mobile),
          website: clean(dto.website),
          taxId: clean(dto.taxId),
          address: clean(dto.address),
          city: clean(dto.city),
          postCode: clean(dto.postCode),
          originCountry: clean(dto.originCountry),
          factoryAddress: clean(dto.factoryAddress),
          factoryCity: clean(dto.factoryCity),
          factoryPostCode: clean(dto.factoryPostCode),
          factoryCountry: clean(dto.factoryCountry),
          status: dto.status,
          salesperson: clean(dto.salesperson),
          commercialPerson: clean(dto.commercialPerson),
          ...(dto.contacts !== undefined
            ? { contacts: dto.contacts as unknown as Prisma.InputJsonValue }
            : {}),
        },
        include: { bankDetails: true },
      });
    });
  }

  async remove(user: any, id: string) {
    const existing = await this.prisma.masterAccount.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Account not found.');

    await this.access.assertScreenPermission(user, existing.type, 'delete');
    await this.access.assertRecordOwnership(user, existing.createdBy);

    await this.prisma.masterAccount.delete({ where: { id } });
    return { ok: true, id };
  }

  async listCustomerAssignments(user: any) {
    await this.access.assertScreenPermission(user, 'Customer Assignment', 'view');

    const scopeIds = await this.access.resolveScopeUserIds(user);
    return this.prisma.masterAccount.findMany({
      where: {
        type: 'Customer',
        ...(scopeIds ? { createdBy: { in: scopeIds } } : {}),
      },
      select: {
        id: true,
        code: true,
        name: true,
        salesperson: true,
        commercialPerson: true,
        status: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async assignCustomer(user: any, id: string, dto: AssignCustomerDto) {
    await this.access.assertScreenPermission(user, 'Customer Assignment', 'edit');

    const existing = await this.prisma.masterAccount.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Customer account not found.');
    if (existing.type !== 'Customer') {
      throw new BadRequestException('Assignments can only be set on Customer accounts.');
    }

    await this.access.assertRecordOwnership(user, existing.createdBy);

    return this.prisma.masterAccount.update({
      where: { id },
      data: {
        salesperson: clean(dto.salesperson),
        commercialPerson: clean(dto.commercialPerson),
      },
      select: {
        id: true,
        code: true,
        name: true,
        salesperson: true,
        commercialPerson: true,
      },
    });
  }
}
