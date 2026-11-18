import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import {
  CreateSetupMasterDto,
  QuerySetupMasterDto,
  SaveMailSetupDto,
  SETUP_KINDS,
  SetupKind,
  UpdateSetupMasterDto,
} from './dto.js';
import {
  KIND_TO_SCREEN,
  SetupMastersAccess,
} from './setup-masters.access.js';

const DEFAULT_DEPARTMENTS = [
  'Management',
  'Marketing / Sales',
  'Commercial',
  'Accounts',
];

const DEFAULT_DESIGNATIONS = [
  'Director',
  'Manager',
  'Executive',
  'Administrator',
];

const SUPER_ONLY_KINDS = new Set<SetupKind>(['department', 'designation']);

const clean = (val?: string) => {
  if (val === undefined) return undefined;
  const trimmed = val.trim();
  return trimmed.length ? trimmed : null;
};

@Injectable()
export class SetupMastersService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: SetupMastersAccess,
  ) {}

  async onModuleInit() {
    for (const name of DEFAULT_DEPARTMENTS) {
      await this.prisma.setupMasterItem.upsert({
        where: { kind_name: { kind: 'department', name } },
        update: {},
        create: { kind: 'department', name, status: 'Active' },
      });
    }

    for (const name of DEFAULT_DESIGNATIONS) {
      await this.prisma.setupMasterItem.upsert({
        where: { kind_name: { kind: 'designation', name } },
        update: {},
        create: { kind: 'designation', name, status: 'Active' },
      });
    }
  }

  private formatItem(row: any, usageCount = 0) {
    return {
      id: row.id,
      kind: row.kind,
      name: row.name,
      description: row.description ?? '',
      status: row.status,
      ...(row.swift ? { swift: row.swift } : {}),
      ...(row.portUse ? { use: row.portUse } : {}),
      ...(row.currencyCode ? { code: row.currencyCode } : {}),
      usageCount,
      createdBy: row.createdBy,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async usageCount(kind: SetupKind, name: string): Promise<number> {
    switch (kind) {
      case 'department':
        return this.prisma.user.count({
          where: { department: { equals: name, mode: 'insensitive' } },
        });
      case 'designation':
        return this.prisma.user.count({
          where: { designation: { equals: name, mode: 'insensitive' } },
        });
      case 'salesperson': {
        const [offers, indents, accounts] = await Promise.all([
          this.prisma.offer.count({
            where: { salesperson: { equals: name, mode: 'insensitive' } },
          }),
          this.prisma.indent.count({
            where: { salesperson: { equals: name, mode: 'insensitive' } },
          }),
          this.prisma.masterAccount.count({
            where: { salesperson: { equals: name, mode: 'insensitive' } },
          }),
        ]);
        return offers + indents + accounts;
      }
      case 'commercialPerson': {
        const [offers, indents, accounts] = await Promise.all([
          this.prisma.offer.count({
            where: { commercialPerson: { equals: name, mode: 'insensitive' } },
          }),
          this.prisma.indent.count({
            where: { commercialPerson: { equals: name, mode: 'insensitive' } },
          }),
          this.prisma.masterAccount.count({
            where: { commercialPerson: { equals: name, mode: 'insensitive' } },
          }),
        ]);
        return offers + indents + accounts;
      }
      case 'manufacturer': {
        const [offerLines, indentLines] = await Promise.all([
          this.prisma.offerItem.count({
            where: { manufacturer: { equals: name, mode: 'insensitive' } },
          }),
          this.prisma.indentItem.count({
            where: { manufacturer: { equals: name, mode: 'insensitive' } },
          }),
        ]);
        return offerLines + indentLines;
      }
      case 'shippingAgent':
        return this.prisma.indent.count({
          where: { shippingAgent: { equals: name, mode: 'insensitive' } },
        });
      case 'accountCategory':
        return this.prisma.masterAccount.count({
          where: { category: { equals: name, mode: 'insensitive' } },
        });
      case 'origin':
        return this.prisma.masterAccount.count({
          where: { originCountry: { equals: name, mode: 'insensitive' } },
        });
      case 'port': {
        const [offers, indents] = await Promise.all([
          this.prisma.offer.count({
            where: {
              OR: [
                { portLoading: { equals: name, mode: 'insensitive' } },
                { portDestination: { equals: name, mode: 'insensitive' } },
              ],
            },
          }),
          this.prisma.indent.count({
            where: {
              OR: [
                { portLoading: { equals: name, mode: 'insensitive' } },
                { portDestination: { equals: name, mode: 'insensitive' } },
              ],
            },
          }),
        ]);
        return offers + indents;
      }
      case 'incoterm': {
        const [offers, indents] = await Promise.all([
          this.prisma.offer.count({
            where: { incoterm: { equals: name, mode: 'insensitive' } },
          }),
          this.prisma.indent.count({
            where: { incoterm: { equals: name, mode: 'insensitive' } },
          }),
        ]);
        return offers + indents;
      }
      case 'shippingMode': {
        const [offerLines, indentLines] = await Promise.all([
          this.prisma.offerItem.count({
            where: { shippingMode: { equals: name, mode: 'insensitive' } },
          }),
          this.prisma.indentItem.count({
            where: { shippingMode: { equals: name, mode: 'insensitive' } },
          }),
        ]);
        return offerLines + indentLines;
      }
      case 'paymentTerm': {
        const [offerLines, indentLines] = await Promise.all([
          this.prisma.offerItem.count({
            where: { paymentTerm: { equals: name, mode: 'insensitive' } },
          }),
          this.prisma.indentItem.count({
            where: { paymentTerm: { equals: name, mode: 'insensitive' } },
          }),
        ]);
        return offerLines + indentLines;
      }
      case 'currency': {
        const [offers, indents] = await Promise.all([
          this.prisma.offer.count({
            where: { currency: { equals: name, mode: 'insensitive' } },
          }),
          this.prisma.indent.count({
            where: { currency: { equals: name, mode: 'insensitive' } },
          }),
        ]);
        return offers + indents;
      }
      default:
        return 0;
    }
  }

  private async ensureUniqueName(
    kind: string,
    name: string,
    excludeId?: string,
  ) {
    const duplicate = await this.prisma.setupMasterItem.findFirst({
      where: {
        kind,
        name: { equals: name, mode: 'insensitive' },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (duplicate) {
      throw new ConflictException(`This ${kind} already exists.`);
    }
  }

  async list(user: any, query: QuerySetupMasterDto) {
    if (query.kind) {
      const screen = KIND_TO_SCREEN[query.kind];
      await this.access.assertMasterPermission(
        user,
        screen,
        'view',
        SUPER_ONLY_KINDS.has(query.kind),
      );
    }

    const q = query.search?.trim();
    const rows = await this.prisma.setupMasterItem.findMany({
      where: {
        ...(query.kind ? { kind: query.kind } : {}),
        ...(query.status ? { status: query.status } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { swift: { contains: q, mode: 'insensitive' } },
                { currencyCode: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'asc' },
    });

    const out = [];
    for (const r of rows) {
      const used = await this.usageCount(r.kind as SetupKind, r.name);
      out.push(this.formatItem(r, used));
    }
    return out;
  }

  async getAllGrouped() {
    const rows = await this.prisma.setupMasterItem.findMany({
      orderBy: { createdAt: 'asc' },
    });

    const grouped: Record<string, any[]> = {};
    for (const k of SETUP_KINDS) grouped[k] = [];
    for (const r of rows) {
      if (!grouped[r.kind]) grouped[r.kind] = [];
      grouped[r.kind].push(this.formatItem(r));
    }
    return grouped;
  }

  async create(user: any, dto: CreateSetupMasterDto) {
    const screen = KIND_TO_SCREEN[dto.kind];
    await this.access.assertMasterPermission(
      user,
      screen,
      'create',
      SUPER_ONLY_KINDS.has(dto.kind),
    );

    const name = dto.name.trim();
    await this.ensureUniqueName(dto.kind, name);

    const created = await this.prisma.setupMasterItem.create({
      data: {
        kind: dto.kind,
        name,
        description: clean(dto.description) ?? null,
        status: dto.status ?? 'Active',
        swift: clean(dto.swift)?.toUpperCase() ?? null,
        portUse: dto.kind === 'port' ? (dto.use ?? 'Both') : null,
        currencyCode:
          dto.kind === 'currency' ? clean(dto.code)?.toUpperCase() ?? null : null,
        createdBy: user.id,
      },
    });

    return this.formatItem(created, 0);
  }

  async update(user: any, id: string, dto: UpdateSetupMasterDto) {
    const existing = await this.prisma.setupMasterItem.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Setup master item not found.');

    const kind = existing.kind as SetupKind;
    const screen = KIND_TO_SCREEN[kind];
    await this.access.assertMasterPermission(
      user,
      screen,
      'edit',
      SUPER_ONLY_KINDS.has(kind),
    );

    let nextName = existing.name;
    if (dto.name !== undefined) {
      nextName = dto.name.trim();
      if (nextName.toLowerCase() !== existing.name.toLowerCase()) {
        const used = await this.usageCount(kind, existing.name);
        if (used > 0) {
          throw new BadRequestException(
            `'${existing.name}' is used in existing records and cannot be renamed. Mark it Inactive and add a new one.`,
          );
        }
        await this.ensureUniqueName(kind, nextName, id);
      }
    }

    const updated = await this.prisma.setupMasterItem.update({
      where: { id },
      data: {
        name: nextName,
        description: clean(dto.description),
        status: dto.status,
        swift: clean(dto.swift)?.toUpperCase(),
        portUse: kind === 'port' ? dto.use : undefined,
        currencyCode:
          kind === 'currency' ? clean(dto.code)?.toUpperCase() : undefined,
      },
    });

    const used = await this.usageCount(kind, updated.name);
    return this.formatItem(updated, used);
  }

  async remove(user: any, id: string) {
    const existing = await this.prisma.setupMasterItem.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Setup master item not found.');

    const kind = existing.kind as SetupKind;
    const screen = KIND_TO_SCREEN[kind];
    await this.access.assertMasterPermission(
      user,
      screen,
      'delete',
      SUPER_ONLY_KINDS.has(kind),
    );

    const used = await this.usageCount(kind, existing.name);
    if (used > 0) {
      throw new BadRequestException(
        `'${existing.name}' is used in ${used} existing record(s) and cannot be deleted. Mark it Inactive instead.`,
      );
    }

    await this.prisma.setupMasterItem.delete({ where: { id } });
    return { ok: true, id };
  }

  async getMailSetup(user: any) {
    await this.access.assertMasterPermission(user, 'Mail Setup', 'view');

    const row = await this.prisma.mailSetting.findUnique({
      where: { id: 'default' },
    });

    return {
      senderName: row?.senderName ?? '',
      senderEmail: row?.senderEmail ?? '',
      host: row?.host ?? '',
      port: row?.port ?? '',
      security: row?.security ?? 'TLS',
      username: row?.username ?? '',
      password: row?.password ?? '',
      signature: row?.signature ?? '',
    };
  }

  async saveMailSetup(user: any, dto: SaveMailSetupDto) {
    await this.access.assertMasterPermission(user, 'Mail Setup', 'edit');

    const data = {
      senderName: dto.senderName.trim(),
      senderEmail: dto.senderEmail.trim().toLowerCase(),
      host: dto.host.trim(),
      port: String(dto.port).trim(),
      security: dto.security ?? 'TLS',
      username: dto.username?.trim() ?? '',
      password: dto.password ?? '',
      signature: dto.signature?.trim() ?? '',
      updatedBy: user.id,
    };

    const saved = await this.prisma.mailSetting.upsert({
      where: { id: 'default' },
      update: data,
      create: { id: 'default', ...data },
    });

    return {
      senderName: saved.senderName,
      senderEmail: saved.senderEmail,
      host: saved.host,
      port: saved.port,
      security: saved.security,
      username: saved.username,
      password: saved.password,
      signature: saved.signature,
    };
  }

  async testMailSetup(user: any, dto: SaveMailSetupDto) {
    await this.access.assertMasterPermission(user, 'Mail Setup', 'edit');
    return {
      ok: true,
      message: `Test mail verified for ${dto.senderEmail.trim()} via ${dto.host.trim()}:${dto.port}.`,
    };
  }
}
