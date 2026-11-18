import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service.js';
import {
  CreateSampleIssueDto,
  CreateSampleReceiveDto,
  QuerySampleDto,
  SampleIssueItemDto,
  SampleReceiveItemDto,
  UpdateSampleIssueDto,
  UpdateSampleReceiveDto,
} from './dto.js';
import { SamplesAccess } from './samples.access.js';

const RECEIVE_BASE_NO = 8022600000;
const ISSUE_BASE_NO = 9022600000;

const clean = (val?: string) => {
  if (val === undefined) return undefined;
  const trimmed = val.trim();
  return trimmed.length ? trimmed : null;
};

const round3 = (n: number) => Math.round(n * 1000) / 1000;
const todayISO = () => new Date().toISOString().slice(0, 10);

const stockKey = (product: string, batchNo: string, unit: string) =>
  `${product.trim().toLowerCase()}|${batchNo.trim().toLowerCase()}|${unit.trim().toLowerCase()}`;

const expiryState = (
  expDate?: string | null,
  today = todayISO(),
  soonDays = 90,
) => {
  if (!expDate) return '';
  if (expDate < today) return 'Expired';
  const limit = new Date(`${today}T00:00:00Z`);
  limit.setUTCDate(limit.getUTCDate() + soonDays);
  return expDate <= limit.toISOString().slice(0, 10)
    ? 'Expiring Soon'
    : 'Valid';
};

@Injectable()
export class SamplesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: SamplesAccess,
  ) {}

  private formatReceive(row: any) {
    const lines = (row.items ?? []).map((item: any) => ({
      id: item.id,
      product: item.product,
      description: item.description ?? '',
      qty: String(item.quantity),
      quantity: Number(item.quantity),
      unit: item.unit,
      packSize: item.packSize ?? '',
      batchNo: item.batchNo,
      mfgDate: item.mfgDate ?? '',
      expDate: item.expDate ?? '',
      origin: item.origin ?? '',
      expiryStatus: expiryState(item.expDate),
    }));

    return {
      id: row.id,
      no: row.no,
      date: row.receiveDate,
      receiveDate: row.receiveDate,
      supplier: row.supplier,
      remarks: row.remarks ?? '',
      createdBy: row.createdBy,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      lines,
    };
  }

  private formatIssue(row: any) {
    const lines = (row.items ?? []).map((item: any) => ({
      id: item.id,
      product: item.product,
      batchNo: item.batchNo,
      unit: item.unit,
      qty: String(item.quantity),
      quantity: Number(item.quantity),
      description: item.description ?? '',
      remarks: item.remarks ?? '',
    }));

    return {
      id: row.id,
      no: row.no,
      date: row.issueDate,
      issueDate: row.issueDate,
      customer: row.customer,
      remarks: row.remarks ?? '',
      createdBy: row.createdBy,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      lines,
    };
  }

  private async generateReceiveNo(customNo?: string): Promise<string> {
    if (customNo?.trim()) {
      const no = customNo.trim();
      const exists = await this.prisma.sampleReceive.findUnique({
        where: { no },
      });
      if (exists) {
        throw new ConflictException(`Sample receive '${no}' already exists.`);
      }
      return no;
    }

    const latest = await this.prisma.sampleReceive.findFirst({
      where: { no: { startsWith: '80226' } },
      orderBy: { no: 'desc' },
      select: { no: true },
    });

    const lastNum = latest
      ? parseInt(latest.no, 10) || RECEIVE_BASE_NO
      : RECEIVE_BASE_NO;
    return String(Math.max(lastNum, RECEIVE_BASE_NO) + 1);
  }

  private async generateIssueNo(customNo?: string): Promise<string> {
    if (customNo?.trim()) {
      const no = customNo.trim();
      const exists = await this.prisma.sampleIssue.findUnique({
        where: { no },
      });
      if (exists) {
        throw new ConflictException(`Sample issue '${no}' already exists.`);
      }
      return no;
    }

    const latest = await this.prisma.sampleIssue.findFirst({
      where: { no: { startsWith: '90226' } },
      orderBy: { no: 'desc' },
      select: { no: true },
    });

    const lastNum = latest
      ? parseInt(latest.no, 10) || ISSUE_BASE_NO
      : ISSUE_BASE_NO;
    return String(Math.max(lastNum, ISSUE_BASE_NO) + 1);
  }

  private validateReceiveLines(lines: SampleReceiveItemDto[]) {
    const seen = new Set<string>();
    for (const l of lines) {
      if (l.mfgDate && l.expDate && l.expDate < l.mfgDate) {
        throw new BadRequestException(
          `Expiry date cannot be before manufacture date for batch '${l.batchNo}'.`,
        );
      }
      const key = stockKey(l.product, l.batchNo, l.unit);
      if (seen.has(key)) {
        throw new BadRequestException(
          `Duplicate batch '${l.batchNo}' for product '${l.product}' (${l.unit}) in the same receive.`,
        );
      }
      seen.add(key);
    }
  }

  private mapReceiveItems(lines: SampleReceiveItemDto[]) {
    return lines.map((l) => ({
      product: l.product.trim(),
      description: clean(l.description) ?? null,
      quantity: new Prisma.Decimal(l.qty),
      unit: l.unit.trim(),
      packSize: clean(l.packSize) ?? null,
      batchNo: l.batchNo.trim(),
      mfgDate: clean(l.mfgDate) ?? null,
      expDate: l.expDate.trim(),
      origin: clean(l.origin) ?? null,
    }));
  }

  private mapIssueItems(lines: SampleIssueItemDto[]) {
    return lines.map((l) => ({
      product: l.product.trim(),
      batchNo: l.batchNo.trim(),
      unit: l.unit.trim(),
      quantity: new Prisma.Decimal(l.qty),
      description: clean(l.description) ?? null,
      remarks: clean(l.remarks) ?? null,
    }));
  }

  private buildStockMap(receives: any[], issues: any[]) {
    const map = new Map<
      string,
      {
        key: string;
        product: string;
        batchNo: string;
        unit: string;
        origin: string;
        mfgDate: string;
        expDate: string;
        packSize: string;
        supplier: string;
        receivedDate: string;
        received: number;
        issued: number;
      }
    >();

    for (const r of receives) {
      for (const l of r.items ?? []) {
        const k = stockKey(l.product, l.batchNo, l.unit);
        const row = map.get(k) ?? {
          key: k,
          product: l.product,
          batchNo: l.batchNo,
          unit: l.unit,
          origin: l.origin ?? '',
          mfgDate: l.mfgDate ?? '',
          expDate: l.expDate ?? '',
          packSize: l.packSize ?? '',
          supplier: r.supplier,
          receivedDate: r.receiveDate,
          received: 0,
          issued: 0,
        };
        row.received = round3(row.received + Number(l.quantity));
        map.set(k, row);
      }
    }

    for (const i of issues) {
      for (const l of i.items ?? []) {
        const k = stockKey(l.product, l.batchNo, l.unit);
        const row = map.get(k) ?? {
          key: k,
          product: l.product,
          batchNo: l.batchNo,
          unit: l.unit,
          origin: '',
          mfgDate: '',
          expDate: '',
          packSize: '',
          supplier: '',
          receivedDate: '',
          received: 0,
          issued: 0,
        };
        row.issued = round3(row.issued + Number(l.quantity));
        map.set(k, row);
      }
    }

    const today = todayISO();
    return Array.from(map.values()).map((r) => ({
      ...r,
      available: round3(r.received - r.issued),
      expiryStatus: expiryState(r.expDate, today),
    }));
  }

  private async findReceiveOrFail(noOrId: string) {
    const receive = await this.prisma.sampleReceive.findFirst({
      where: { OR: [{ no: noOrId }, { id: noOrId }] },
      include: { items: true },
    });
    if (!receive) {
      throw new NotFoundException(`Sample receive '${noOrId}' not found.`);
    }
    return receive;
  }

  private async findIssueOrFail(noOrId: string) {
    const issue = await this.prisma.sampleIssue.findFirst({
      where: { OR: [{ no: noOrId }, { id: noOrId }] },
      include: { items: true },
    });
    if (!issue) {
      throw new NotFoundException(`Sample issue '${noOrId}' not found.`);
    }
    return issue;
  }

  async listReceives(user: any, query: QuerySampleDto) {
    await this.access.assertScreenPermission(user, 'Sample Receive', 'view');

    const scopeIds = await this.access.resolveScopeUserIds(user);
    const q = query.search?.trim();

    const rows = await this.prisma.sampleReceive.findMany({
      where: {
        ...(scopeIds ? { createdBy: { in: scopeIds } } : {}),
        ...(query.supplier && query.supplier !== 'All'
          ? { supplier: { equals: query.supplier, mode: 'insensitive' } }
          : {}),
        ...(q
          ? {
              OR: [
                { no: { contains: q, mode: 'insensitive' } },
                { supplier: { contains: q, mode: 'insensitive' } },
                {
                  items: {
                    some: {
                      OR: [
                        { product: { contains: q, mode: 'insensitive' } },
                        { batchNo: { contains: q, mode: 'insensitive' } },
                      ],
                    },
                  },
                },
              ],
            }
          : {}),
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((r) => this.formatReceive(r));
  }

  async getReceiveByNo(user: any, noOrId: string) {
    const receive = await this.findReceiveOrFail(noOrId);
    await this.access.assertScreenPermission(user, 'Sample Receive', 'view');
    await this.access.assertRecordOwnership(user, receive.createdBy);
    return this.formatReceive(receive);
  }

  async createReceive(user: any, dto: CreateSampleReceiveDto) {
    await this.access.assertScreenPermission(user, 'Sample Receive', 'create');
    this.validateReceiveLines(dto.lines);

    const no = await this.generateReceiveNo(dto.no);
    const itemRows = this.mapReceiveItems(dto.lines);

    const created = await this.prisma.sampleReceive.create({
      data: {
        no,
        receiveDate: dto.date.trim(),
        supplier: dto.supplier.trim(),
        remarks: clean(dto.remarks) ?? null,
        createdBy: user.id,
        items: { create: itemRows },
      },
      include: { items: true },
    });

    return this.formatReceive(created);
  }

  async updateReceive(user: any, noOrId: string, dto: UpdateSampleReceiveDto) {
    const existing = await this.findReceiveOrFail(noOrId);

    await this.access.assertScreenPermission(user, 'Sample Receive', 'edit');
    await this.access.assertRecordOwnership(user, existing.createdBy);

    if (dto.lines !== undefined) {
      this.validateReceiveLines(dto.lines);

      const otherReceives = await this.prisma.sampleReceive.findMany({
        where: { id: { not: existing.id } },
        include: { items: true },
      });
      const allIssues = await this.prisma.sampleIssue.findMany({
        include: { items: true },
      });

      const simulatedReceive = {
        ...existing,
        supplier: dto.supplier?.trim() ?? existing.supplier,
        receiveDate: dto.date?.trim() ?? existing.receiveDate,
        items: dto.lines.map((l) => ({
          product: l.product,
          batchNo: l.batchNo,
          unit: l.unit,
          origin: l.origin,
          mfgDate: l.mfgDate,
          expDate: l.expDate,
          packSize: l.packSize,
          quantity: l.qty,
        })),
      };

      const stockAfter = this.buildStockMap(
        [...otherReceives, simulatedReceive],
        allIssues,
      );
      const negative = stockAfter.find((s) => s.available < 0);
      if (negative) {
        throw new BadRequestException(
          `Batch '${negative.batchNo}' of '${negative.product}' was already issued (${negative.issued} ${negative.unit}). Received quantity cannot go below that.`,
        );
      }
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      if (dto.lines !== undefined) {
        await tx.sampleReceiveItem.deleteMany({
          where: { receiveNo: existing.no },
        });
        const itemRows = this.mapReceiveItems(dto.lines);
        await tx.sampleReceiveItem.createMany({
          data: itemRows.map((item) => ({ ...item, receiveNo: existing.no })),
        });
      }

      return tx.sampleReceive.update({
        where: { id: existing.id },
        data: {
          receiveDate: dto.date?.trim(),
          supplier: dto.supplier?.trim(),
          remarks: clean(dto.remarks),
        },
        include: { items: true },
      });
    });

    return this.formatReceive(updated);
  }

  async removeReceive(user: any, noOrId: string) {
    const existing = await this.findReceiveOrFail(noOrId);

    await this.access.assertScreenPermission(user, 'Sample Receive', 'delete');
    await this.access.assertRecordOwnership(user, existing.createdBy);

    const otherReceives = await this.prisma.sampleReceive.findMany({
      where: { id: { not: existing.id } },
      include: { items: true },
    });
    const allIssues = await this.prisma.sampleIssue.findMany({
      include: { items: true },
    });

    const stockAfter = this.buildStockMap(otherReceives, allIssues);
    const negative = stockAfter.find((s) => s.available < 0);
    if (negative) {
      throw new BadRequestException(
        `Batch '${negative.batchNo}' of '${negative.product}' was already issued to customers and cannot be deleted.`,
      );
    }

    await this.prisma.sampleReceive.delete({ where: { id: existing.id } });
    return { ok: true, no: existing.no };
  }

  private async validateIssueAgainstStock(
    lines: SampleIssueItemDto[],
    excludeIssueId?: string,
  ) {
    const allReceives = await this.prisma.sampleReceive.findMany({
      include: { items: true },
    });
    const otherIssues = await this.prisma.sampleIssue.findMany({
      where: excludeIssueId ? { id: { not: excludeIssueId } } : {},
      include: { items: true },
    });

    const baseStock = this.buildStockMap(allReceives, otherIssues);
    const today = todayISO();

    const requestedByKey = new Map<
      string,
      { product: string; batchNo: string; unit: string; qty: number }
    >();

    for (const l of lines) {
      const k = stockKey(l.product, l.batchNo, l.unit);
      const stockRow = baseStock.find((s) => s.key === k);
      if (!stockRow || stockRow.received <= 0) {
        throw new BadRequestException(
          `Batch '${l.batchNo}' of '${l.product}' (${l.unit}) does not exist in sample stock.`,
        );
      }
      if (expiryState(stockRow.expDate, today) === 'Expired') {
        throw new BadRequestException(
          `Batch '${l.batchNo}' of '${l.product}' is expired (${stockRow.expDate}) and cannot be issued.`,
        );
      }

      const prev = requestedByKey.get(k) ?? {
        product: l.product,
        batchNo: l.batchNo,
        unit: l.unit,
        qty: 0,
      };
      prev.qty = round3(prev.qty + Number(l.qty));
      requestedByKey.set(k, prev);
    }

    for (const [k, req] of requestedByKey.entries()) {
      const stockRow = baseStock.find((s) => s.key === k)!;
      if (req.qty > stockRow.available + 0.0001) {
        throw new BadRequestException(
          `Only ${stockRow.available} ${req.unit} of '${req.product}' (batch '${req.batchNo}') is available.`,
        );
      }
    }
  }

  async listIssues(user: any, query: QuerySampleDto) {
    await this.access.assertScreenPermission(user, 'Sample Issue', 'view');

    const scopeIds = await this.access.resolveScopeUserIds(user);
    const q = query.search?.trim();

    const rows = await this.prisma.sampleIssue.findMany({
      where: {
        ...(scopeIds ? { createdBy: { in: scopeIds } } : {}),
        ...(query.customer && query.customer !== 'All'
          ? { customer: { equals: query.customer, mode: 'insensitive' } }
          : {}),
        ...(q
          ? {
              OR: [
                { no: { contains: q, mode: 'insensitive' } },
                { customer: { contains: q, mode: 'insensitive' } },
                {
                  items: {
                    some: {
                      OR: [
                        { product: { contains: q, mode: 'insensitive' } },
                        { batchNo: { contains: q, mode: 'insensitive' } },
                      ],
                    },
                  },
                },
              ],
            }
          : {}),
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((r) => this.formatIssue(r));
  }

  async getIssueByNo(user: any, noOrId: string) {
    const issue = await this.findIssueOrFail(noOrId);
    await this.access.assertScreenPermission(user, 'Sample Issue', 'view');
    await this.access.assertRecordOwnership(user, issue.createdBy);
    return this.formatIssue(issue);
  }

  async createIssue(user: any, dto: CreateSampleIssueDto) {
    await this.access.assertScreenPermission(user, 'Sample Issue', 'create');
    await this.validateIssueAgainstStock(dto.lines);

    const no = await this.generateIssueNo(dto.no);
    const itemRows = this.mapIssueItems(dto.lines);

    const created = await this.prisma.sampleIssue.create({
      data: {
        no,
        issueDate: dto.date.trim(),
        customer: dto.customer.trim(),
        remarks: clean(dto.remarks) ?? null,
        createdBy: user.id,
        items: { create: itemRows },
      },
      include: { items: true },
    });

    return this.formatIssue(created);
  }

  async updateIssue(user: any, noOrId: string, dto: UpdateSampleIssueDto) {
    const existing = await this.findIssueOrFail(noOrId);

    await this.access.assertScreenPermission(user, 'Sample Issue', 'edit');
    await this.access.assertRecordOwnership(user, existing.createdBy);

    if (dto.lines !== undefined) {
      await this.validateIssueAgainstStock(dto.lines, existing.id);
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      if (dto.lines !== undefined) {
        await tx.sampleIssueItem.deleteMany({
          where: { issueNo: existing.no },
        });
        const itemRows = this.mapIssueItems(dto.lines);
        await tx.sampleIssueItem.createMany({
          data: itemRows.map((item) => ({ ...item, issueNo: existing.no })),
        });
      }

      return tx.sampleIssue.update({
        where: { id: existing.id },
        data: {
          issueDate: dto.date?.trim(),
          customer: dto.customer?.trim(),
          remarks: clean(dto.remarks),
        },
        include: { items: true },
      });
    });

    return this.formatIssue(updated);
  }

  async removeIssue(user: any, noOrId: string) {
    const existing = await this.findIssueOrFail(noOrId);

    await this.access.assertScreenPermission(user, 'Sample Issue', 'delete');
    await this.access.assertRecordOwnership(user, existing.createdBy);

    await this.prisma.sampleIssue.delete({ where: { id: existing.id } });
    return { ok: true, no: existing.no };
  }

  async getReceiveReport(user: any, query: QuerySampleDto) {
    await this.access.assertScreenPermission(
      user,
      'Sample Receive Report',
      'view',
    );

    const scopeIds = await this.access.resolveScopeUserIds(user);
    const dateFilter: Prisma.StringFilter = {};
    if (query.from?.trim()) dateFilter.gte = query.from.trim();
    if (query.to?.trim()) dateFilter.lte = query.to.trim();

    const receives = await this.prisma.sampleReceive.findMany({
      where: {
        ...(scopeIds ? { createdBy: { in: scopeIds } } : {}),
        ...(Object.keys(dateFilter).length ? { receiveDate: dateFilter } : {}),
        ...(query.supplier && query.supplier !== 'All'
          ? { supplier: { equals: query.supplier, mode: 'insensitive' } }
          : {}),
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    const prodFilter =
      query.product && query.product !== 'All'
        ? query.product.trim().toLowerCase()
        : null;
    const batchFilter = query.batch?.trim().toLowerCase() || null;

    const rows = receives.flatMap((r) => {
      const formatted = this.formatReceive(r);
      return formatted.lines
        .filter(
          (l: any) =>
            (!prodFilter || l.product.toLowerCase() === prodFilter) &&
            (!batchFilter || l.batchNo.toLowerCase().includes(batchFilter)),
        )
        .map((l: any, idx: number) => ({
          key: `${formatted.no}-${idx}`,
          receiveNo: formatted.no,
          date: formatted.date,
          supplier: formatted.supplier,
          createdBy: formatted.createdBy,
          line: l,
        }));
    });

    const totalQty = round3(
      rows.reduce((sum, r) => sum + Number(r.line.qty || 0), 0),
    );

    return {
      stats: {
        totalReceives: new Set(rows.map((r) => r.receiveNo)).size,
        totalLines: rows.length,
        totalQty,
      },
      rows,
    };
  }

  async getIssueReport(user: any, query: QuerySampleDto) {
    await this.access.assertScreenPermission(
      user,
      'Sample Issue Report',
      'view',
    );

    const scopeIds = await this.access.resolveScopeUserIds(user);
    const dateFilter: Prisma.StringFilter = {};
    if (query.from?.trim()) dateFilter.gte = query.from.trim();
    if (query.to?.trim()) dateFilter.lte = query.to.trim();

    const issues = await this.prisma.sampleIssue.findMany({
      where: {
        ...(scopeIds ? { createdBy: { in: scopeIds } } : {}),
        ...(Object.keys(dateFilter).length ? { issueDate: dateFilter } : {}),
        ...(query.customer && query.customer !== 'All'
          ? { customer: { equals: query.customer, mode: 'insensitive' } }
          : {}),
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    const prodFilter =
      query.product && query.product !== 'All'
        ? query.product.trim().toLowerCase()
        : null;
    const batchFilter = query.batch?.trim().toLowerCase() || null;

    const rows = issues.flatMap((i) => {
      const formatted = this.formatIssue(i);
      return formatted.lines
        .filter(
          (l: any) =>
            (!prodFilter || l.product.toLowerCase() === prodFilter) &&
            (!batchFilter || l.batchNo.toLowerCase().includes(batchFilter)),
        )
        .map((l: any, idx: number) => ({
          key: `${formatted.no}-${idx}`,
          issueNo: formatted.no,
          date: formatted.date,
          customer: formatted.customer,
          createdBy: formatted.createdBy,
          line: l,
        }));
    });

    const totalQty = round3(
      rows.reduce((sum, r) => sum + Number(r.line.qty || 0), 0),
    );

    return {
      stats: {
        totalIssues: new Set(rows.map((r) => r.issueNo)).size,
        totalLines: rows.length,
        totalQty,
      },
      rows,
    };
  }

  async getStockReport(user: any, query: QuerySampleDto) {
    await this.access.assertScreenPermission(
      user,
      'Sample Stock Report',
      'view',
    );

    const scopeIds = await this.access.resolveScopeUserIds(user);
    const receives = await this.prisma.sampleReceive.findMany({
      where: scopeIds ? { createdBy: { in: scopeIds } } : {},
      include: { items: true },
    });
    const issues = await this.prisma.sampleIssue.findMany({
      where: scopeIds ? { createdBy: { in: scopeIds } } : {},
      include: { items: true },
    });

    const allStock = this.buildStockMap(receives, issues);
    const prodFilter =
      query.product && query.product !== 'All'
        ? query.product.trim().toLowerCase()
        : null;
    const supFilter =
      query.supplier && query.supplier !== 'All'
        ? query.supplier.trim().toLowerCase()
        : null;
    const batchFilter = query.batch?.trim().toLowerCase() || null;
    const expFilter =
      query.expiry && query.expiry !== 'All' ? query.expiry : null;

    const rows = allStock.filter(
      (s) =>
        (!prodFilter || s.product.toLowerCase() === prodFilter) &&
        (!supFilter || s.supplier.toLowerCase() === supFilter) &&
        (!batchFilter || s.batchNo.toLowerCase().includes(batchFilter)) &&
        (!expFilter || s.expiryStatus === expFilter),
    );

    return {
      stats: {
        totalBatches: rows.length,
        availableBatches: rows.filter((s) => s.available > 0).length,
        expiringSoon: rows.filter((s) => s.expiryStatus === 'Expiring Soon')
          .length,
        expired: rows.filter((s) => s.expiryStatus === 'Expired').length,
      },
      rows,
    };
  }
}
