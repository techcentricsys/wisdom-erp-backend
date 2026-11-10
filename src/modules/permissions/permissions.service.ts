import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RolePermissions } from '../../auth/permissions.map';

const ACTIONS = ['access', 'view', 'create', 'edit', 'delete'] as const;
const SCREENS: Record<string, string[]> = {
  dashboard: ['dashboard-home'],
  inventory: [
    'inventory-items',
    'goods-received',
    'quality-inspection',
    'stock-issuance',
    'purchase-orders',
    'suppliers',
  ],
  finance: [
    'finance-transactions',
    'finance-journal',
    'finance-ledger',
    'finance-chart',
    'finance-errored',
  ],
  reports: ['reports-financial', 'reports-inventory'],
  administration: ['admin-company', 'admin-users', 'admin-roles'],
   hr: [
    'hr-departments',
    'hr-employees',
    'hr-salary',
    'hr-attendance',
    'hr-leave',
    'hr-shifts',
    'hr-loans',
    'hr-expenses',
    'hr-reports',
    'hr-loans',
  ],
};

const LEGACY_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: ['*'],
  [UserRole.MANAGER]: ['inventory.view', 'inventory.manage', 'finance.view', 'reports.view'],
  [UserRole.ACCOUNTANT]: ['finance.view', 'finance.post', 'reports.view'],
  [UserRole.WAREHOUSE_STAFF]: [
    'inventory.view',
    'inventory.receive',
    'inventory.issue',
    'inventory.transfer',
  ],
  [UserRole.PROCUREMENT_OFFICER]: ['inventory.view', 'purchasing.manage'],
  [UserRole.INSPECTOR]: ['inventory.view', 'inspection.manage'],
};

const ALL_SCREEN_CODES = Object.entries(SCREENS).flatMap(([moduleId, screenIds]) =>
  screenIds.flatMap((screenId) => ACTIONS.map((action) => `${moduleId}.${screenId}.${action}`)),
);
const ALL_PERMISSION_CODES = [
  ...new Set([
    ...ALL_SCREEN_CODES,
    ...Object.values(LEGACY_ROLE_PERMISSIONS).flat().filter((code) => code !== '*'),
  ]),
];

const roleName = (role: string) =>
  role
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

@Injectable()
export class PermissionsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    for (const role of Object.values(UserRole)) {
      const existing = await this.prisma.accessRole.findUnique({ where: { id: role } });
      if (!existing) {
        await this.prisma.accessRole.create({
          data: {
            id: role,
            name: roleName(role),
            description: `Built-in role: ${roleName(role)}`,
            isSystem: true,
          },
        });
      }
    }

    await this.prisma.accessPermission.createMany({
      data: ALL_PERMISSION_CODES.map((code) => ({ code, description: `Permission: ${code}` })),
      skipDuplicates: true,
    });

    for (const [roleKey, codes] of Object.entries(RolePermissions) as [UserRole, string[]][]) {
      const count = await this.prisma.accessRolePermission.count({ where: { roleId: roleKey } });
      if (count === 0 && codes.length > 0 && codes[0] !== '*') {
        const perms = await this.prisma.accessPermission.findMany({
          where: { code: { in: codes } },
          select: { id: true },
        });
        if (perms.length) {
          await this.prisma.accessRolePermission.createMany({
            data: perms.map((p) => ({ roleId: roleKey, permissionId: p.id })),
            skipDuplicates: true,
          });
        }
      }
    }

    // Existing accounts created before the access-role tables were introduced keep their role.
    for (const role of Object.values(UserRole)) {
      await this.prisma.user.updateMany({
        where: { role, accessRoleId: null },
        data: { accessRoleId: role },
      });
    }
  }

  async listRoles() {
    const roles = await this.prisma.accessRole.findMany({
      orderBy: [{ isSystem: 'desc' }, { name: 'asc' }],
      select: { id: true, name: true, description: true, isSystem: true },
    });
    return roles.sort((a, b) => {
      if (a.id === UserRole.ADMIN) return b.id === UserRole.ADMIN ? 0 : -1;
      if (b.id === UserRole.ADMIN) return 1;
      return Number(b.isSystem) - Number(a.isSystem) || a.name.localeCompare(b.name);
    }).map(({ isSystem: _isSystem, ...role }) => role);
  }

  async createRole(name: string) {
    const normalizedName = typeof name === 'string' ? name.trim().replace(/\s+/g, ' ') : '';
    if (!normalizedName) throw new BadRequestException('Role name is required.');
    const duplicate = await this.prisma.accessRole.findFirst({
      where: { name: { equals: normalizedName, mode: 'insensitive' } },
    });
    if (duplicate) throw new ConflictException('A role with this name already exists.');
    return this.prisma.accessRole.create({
      data: { name: normalizedName, description: null, isSystem: false },
      select: { id: true, name: true, description: true },
    });
  }

  async deleteRole(id: string) {
    const role = await this.prisma.accessRole.findUnique({ where: { id } });
    if (!role) throw new NotFoundException('Role not found.');
    if (role.isSystem) throw new BadRequestException('Built-in roles cannot be deleted.');
    const assignedUsers = await this.prisma.user.count({ where: { accessRoleId: id } });
    if (assignedUsers) {
      throw new ConflictException('Move users to another role before deleting this role.');
    }
    await this.prisma.accessRole.delete({ where: { id } });
    return { success: true };
  }

  listPermissions() {
    return this.prisma.accessPermission.findMany({ orderBy: { code: 'asc' } });
  }

  async createPermission(code: string) {
    const normalizedCode = typeof code === 'string' ? code.trim() : '';
    if (!normalizedCode) throw new BadRequestException('Permission code is required.');
    return this.prisma.accessPermission.upsert({
      where: { code: normalizedCode },
      create: { code: normalizedCode, description: `Permission: ${normalizedCode}` },
      update: {},
    });
  }

  async listUsers(companyId: string, userType?: string) {
    if (userType && userType !== 'STAFF' && userType !== 'CLIENT') {
      throw new BadRequestException('userType must be STAFF or CLIENT.');
    }
    const users = await this.prisma.user.findMany({
      where: {
        companyId,
        ...(userType ? { userType } : {}),
      },
      include: { accessRole: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'asc' },
    });
    return users.map((user) => this.toPermissionUser(user));
  }

  async createUser(companyId: string, payload: CreateUserDto) {
    const role = await this.requireRole(payload.roleId);
    const fullName = `${payload.firstName ?? ''} ${payload.lastName ?? ''}`.trim();
    if (!fullName) throw new BadRequestException('User name is required.');
    const email = payload.email.trim().toLowerCase();
    const phone = payload.phone?.trim() || null;
    await this.ensureUniqueUserContact(companyId, email, phone);
    const passwordHash = await bcrypt.hash(payload.password, 10);
    const user = await this.prisma.user.create({
      data: {
        companyId,
        fullName,
        email,
        passwordHash,
        phone,
        userType: this.normalizeUserType(payload.userType ?? payload.kind),
        isActive: true,
        role: this.builtInRole(role.id) ?? UserRole.WAREHOUSE_STAFF,
        accessRoleId: role.id,
      },
      include: { accessRole: { select: { id: true, name: true } } },
    });
    return this.toPermissionUser(user);
  }

  async updateUser(
    companyId: string,
    id: string,
    payload: {
      firstName: string;
      lastName: string;
      email: string;
      roleId: string;
      phone?: string;
      kind?: string;
      userType?: string;
      password?: string;
    },
  ) {
    const role = await this.requireRole(payload.roleId);
    const fullName = `${payload.firstName ?? ''} ${payload.lastName ?? ''}`.trim();
    if (!fullName) throw new BadRequestException('User name is required.');
    const existingUser = await this.prisma.user.findFirst({
      where: { id, companyId },
      select: { id: true },
    });
    if (!existingUser) throw new NotFoundException('User not found in your company.');
    const email = payload.email.trim().toLowerCase();
    const phone = payload.phone === undefined ? undefined : payload.phone.trim() || null;
    await this.ensureUniqueUserContact(companyId, email, phone, id);
    const builtInRole = this.builtInRole(role.id) ?? UserRole.WAREHOUSE_STAFF;
    await this.ensureNotLastActiveAdmin(companyId, id, builtInRole);

    let passwordHash: string | undefined;
    if (payload.password && payload.password.trim().length > 0) {
      if (payload.password.trim().length < 6) {
        throw new BadRequestException('Password must be at least 6 characters.');
      }
      passwordHash = await bcrypt.hash(payload.password.trim(), 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        fullName,
        email,
        ...(passwordHash ? { passwordHash } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...((payload.kind !== undefined || payload.userType !== undefined)
          ? { userType: this.normalizeUserType(payload.userType ?? payload.kind) }
          : {}),
        role: builtInRole,
        accessRoleId: role.id,
      },
      include: { accessRole: { select: { id: true, name: true } } },
    });
    return this.toPermissionUser(user);
  }

  async updateUserStatus(companyId: string, id: string, isActive: boolean) {
    if (typeof isActive !== 'boolean') throw new BadRequestException('isActive must be true or false.');
    const current = await this.prisma.user.findFirst({
      where: { id, companyId },
      select: { role: true, isActive: true },
    });
    if (!current) throw new NotFoundException('User not found in your company.');
    if (!isActive && current.isActive && current.role === UserRole.ADMIN) {
      const activeAdmins = await this.prisma.user.count({
        where: { companyId, role: UserRole.ADMIN, isActive: true },
      });
      if (activeAdmins <= 1) {
        throw new ConflictException('The last active administrator cannot be deactivated.');
      }
    }
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive },
      include: { accessRole: { select: { id: true, name: true } } },
    });
    return this.toPermissionUser(user);
  }

  async deleteUser(companyId: string, id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, companyId },
      select: { role: true },
    });
    if (!user) throw new NotFoundException('User not found in your company.');
    if (user.role === UserRole.ADMIN) {
      const admins = await this.prisma.user.count({
        where: { companyId, role: UserRole.ADMIN, isActive: true },
      });
      if (admins <= 1) throw new ConflictException('The last active administrator cannot be deleted.');
    }
    await this.prisma.user.delete({ where: { id } });
    return { success: true };
  }

  async getRolePermissions(roleId: string) {
    const role = await this.prisma.accessRole.findUnique({
      where: { id: roleId },
      include: { permissions: { include: { permission: true } } },
    });
    if (!role) throw new NotFoundException('Role not found.');
    return { permissions: role.permissions.map(({ permission }) => permission) };
  }

  async replaceRolePermissions(roleId: string, permissionIds: string[]) {
    if (!Array.isArray(permissionIds) || permissionIds.some((id) => typeof id !== 'string')) {
      throw new BadRequestException('permissionIds must be an array of permission IDs.');
    }
    await this.requireRole(roleId);
    const uniqueIds = [...new Set(permissionIds)];
    const foundCount = await this.prisma.accessPermission.count({ where: { id: { in: uniqueIds } } });
    if (foundCount !== uniqueIds.length) throw new BadRequestException('One or more permissions do not exist.');

    await this.prisma.$transaction(async (tx) => {
      await tx.accessRolePermission.deleteMany({ where: { roleId } });
      if (uniqueIds.length) {
        await tx.accessRolePermission.createMany({
          data: uniqueIds.map((permissionId) => ({ roleId, permissionId })),
        });
      }
    });
    return { success: true };
  }

  async assignRole(companyId: string, userId: string, roleId: string) {
    const role = await this.requireRole(roleId);
    const user = await this.prisma.user.findFirst({
      where: { id: userId, companyId },
      select: { id: true },
    });
    if (!user) throw new NotFoundException('User not found in your company.');
    const builtInRole = this.builtInRole(role.id) ?? UserRole.WAREHOUSE_STAFF;
    await this.ensureNotLastActiveAdmin(companyId, userId, builtInRole);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        accessRoleId: role.id,
        role: builtInRole,
      },
    });
    return { success: true };
  }

  private async requireRole(id: string) {
    const role = await this.prisma.accessRole.findUnique({ where: { id } });
    if (!role) throw new NotFoundException('Role not found.');
    return role;
  }

  private async ensureUniqueUserContact(
    companyId: string,
    email: string,
    phone: string | null | undefined,
    excludeUserId?: string,
  ) {
    const exclude = excludeUserId ? { id: { not: excludeUserId } } : {};
    const existingEmail = await this.prisma.user.findFirst({
      where: { companyId, email: { equals: email, mode: 'insensitive' }, ...exclude },
      select: { id: true },
    });
    if (existingEmail) throw new ConflictException('A user with this email already exists in your company.');

    if (phone) {
      const existingPhone = await this.prisma.user.findFirst({
        where: { companyId, phone, ...exclude },
        select: { id: true },
      });
      if (existingPhone) throw new ConflictException('A user with this phone number already exists in your company.');
    }
  }

  private builtInRole(id: string): UserRole | undefined {
    return Object.values(UserRole).find((role) => role === id);
  }

  private async ensureNotLastActiveAdmin(companyId: string, userId: string, nextRole: UserRole) {
    const current = await this.prisma.user.findFirst({
      where: { id: userId, companyId },
      select: { role: true, isActive: true },
    });
    if (!current) throw new NotFoundException('User not found in your company.');
    if (current?.isActive && current.role === UserRole.ADMIN && nextRole !== UserRole.ADMIN) {
      const activeAdmins = await this.prisma.user.count({
        where: { companyId, role: UserRole.ADMIN, isActive: true },
      });
      if (activeAdmins <= 1) {
        throw new ConflictException('The last active administrator cannot be assigned another role.');
      }
    }
  }

  private normalizeUserType(value?: string) {
    const normalized = (value ?? 'STAFF').trim().toUpperCase();
    if (normalized !== 'STAFF' && normalized !== 'CLIENT') {
      throw new BadRequestException('User type must be Staff or Client.');
    }
    return normalized;
  }

  private toPermissionUser(user: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    userType: string;
    isActive: boolean;
    role: UserRole;
    accessRoleId: string | null;
    accessRole: { id: string; name: string } | null;
    createdAt: Date;
  }) {
    const nameParts = user.fullName.split(/\s+/).filter(Boolean);
    const role = user.accessRole ?? {
      id: user.accessRoleId ?? user.role,
      name: roleName(user.role),
    };
    return {
      id: user.id,
      email: user.email,
      firstName: nameParts[0] ?? '',
      lastName: nameParts.slice(1).join(' '),
      phone: user.phone,
      userType: user.userType,
      kind: user.userType === 'CLIENT' ? 'Client' : 'Staff',
      role: role.name,
      roleId: role.id,
      status: user.isActive ? 'ACTIVE' : 'INACTIVE',
      userRoles: [{ role }],
      createdAt: user.createdAt,
    };
  }
}
