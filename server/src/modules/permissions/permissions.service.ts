import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service.js';

const BUILT_IN_ROLES = ['ADMIN', 'MANAGER', 'OPERATOR'];

@Injectable()
export class PermissionsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    for (const name of BUILT_IN_ROLES) {
      await this.prisma.role.upsert({
        where: { name },
        update: {},
        create: { name, description: 'Built-in Wisdom ERP role.' },
      });
    }
  }

  async listRoles() {
    return this.prisma.role.findMany({ orderBy: { name: 'asc' } });
  }

  async createRole(name: string) {
    const normalized = typeof name === 'string' ? name.trim().replace(/\s+/g, ' ') : '';
    if (!normalized) throw new BadRequestException('Role name is required.');
    try {
      return await this.prisma.role.create({ data: { name: normalized } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A role with this name already exists.');
      }
      throw error;
    }
  }

  async deleteRole(id: string) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException('Role not found.');
    if (role.name.toUpperCase() === 'ADMIN') {
      throw new ForbiddenException('The Administrator role cannot be deleted.');
    }
    const assigned = await this.prisma.userRole.count({ where: { roleId: id } });
    if (assigned) throw new ConflictException('Reassign this role users before deleting it.');
    await this.prisma.$transaction([
      this.prisma.rolePermission.deleteMany({ where: { roleId: id } }),
      this.prisma.role.delete({ where: { id } }),
    ]);
    return { success: true };
  }

  async listPermissions() {
    return this.prisma.permission.findMany({ orderBy: { code: 'asc' } });
  }

  async createPermission(code: string) {
    const normalized = typeof code === 'string' ? code.trim() : '';
    if (!/^[a-z0-9-]+\.[a-z0-9-]+\.(access|view|create|edit|delete)$/i.test(normalized)) {
      throw new BadRequestException('Permission code must use module.screen.action format.');
    }
    return this.prisma.permission.upsert({
      where: { code: normalized },
      update: {},
      create: { code: normalized, description: 'Wisdom ERP screen permission.' },
    });
  }

  async listUsers(actorId: string) {
    const companyId = await this.companyIdFor(actorId);
    return this.prisma.user.findMany({
      where: { companyId },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        userRoles: { include: { role: { select: { id: true, name: true } } } },
      },
    });
  }

  async createUser(actorId: string, payload: { firstName: string; lastName: string; email: string; password: string; roleId: string }) {
    const firstName = typeof payload.firstName === 'string' ? payload.firstName.trim() : '';
    const lastName = typeof payload.lastName === 'string' ? payload.lastName.trim() : '';
    const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
    const password = typeof payload.password === 'string' ? payload.password : '';
    if (!firstName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException('A first name and valid email are required.');
    }
    if (password.length < 8) throw new BadRequestException('Password must be at least 8 characters.');
    const companyId = await this.companyIdFor(actorId);
    const role = await this.prisma.role.findUnique({ where: { id: payload.roleId }, select: { id: true } });
    if (!role) throw new NotFoundException('Role not found.');
    const passwordHash = await bcrypt.hash(password, 12);
    try {
      return await this.prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          passwordHash,
          companyId,
          userRoles: { create: { roleId: role.id } },
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          status: true,
          userRoles: { include: { role: { select: { id: true, name: true } } } },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A user with this email already exists.');
      }
      throw error;
    }
  }

  async updateUser(actorId: string, userId: string, payload: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    roleId?: string;
    status?: string;
  }) {
    const companyId = await this.companyIdFor(actorId);
    const target = await this.prisma.user.findFirst({
      where: { id: userId, companyId },
      include: { userRoles: { include: { role: { select: { name: true } } } } },
    });
    if (!target) throw new NotFoundException('User not found in your company.');

    const data: Prisma.UserUpdateInput = {};
    if (payload.firstName !== undefined) {
      if (typeof payload.firstName !== 'string' || !payload.firstName.trim()) throw new BadRequestException('First name is required.');
      data.firstName = payload.firstName.trim();
    }
    if (payload.lastName !== undefined) {
      if (typeof payload.lastName !== 'string') throw new BadRequestException('Last name must be text.');
      data.lastName = payload.lastName.trim();
    }
    if (payload.email !== undefined) {
      if (typeof payload.email !== 'string') throw new BadRequestException('A valid email is required.');
      const email = payload.email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BadRequestException('A valid email is required.');
      data.email = email;
    }
    if (payload.password) {
      if (typeof payload.password !== 'string' || payload.password.length < 8) throw new BadRequestException('Password must be at least 8 characters.');
      data.passwordHash = await bcrypt.hash(payload.password, 12);
    }
    if (payload.status !== undefined) {
      if (typeof payload.status !== 'string') throw new BadRequestException('Status must be ACTIVE, INACTIVE, or SUSPENDED.');
      const status = payload.status.toUpperCase();
      if (!['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(status)) {
        throw new BadRequestException('Status must be ACTIVE, INACTIVE, or SUSPENDED.');
      }
      if (status !== 'ACTIVE' && actorId === userId) throw new ForbiddenException('You cannot deactivate your own account.');
      const targetIsAdmin = target.userRoles.some(({ role }) => role.name.toUpperCase() === 'ADMIN');
      if (status !== 'ACTIVE' && target.status === 'ACTIVE' && targetIsAdmin) {
        const activeAdmins = await this.prisma.user.count({
          where: { companyId, status: 'ACTIVE', userRoles: { some: { role: { name: 'ADMIN' } } } },
        });
        if (activeAdmins <= 1) throw new ForbiddenException('The last active administrator cannot be deactivated.');
      }
      data.status = status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    }

    let roleId: string | undefined;
    if (payload.roleId !== undefined) {
      const role = await this.prisma.role.findUnique({ where: { id: payload.roleId }, select: { id: true } });
      if (!role) throw new NotFoundException('Role not found.');
      roleId = role.id;
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        if (Object.keys(data).length) await tx.user.update({ where: { id: userId }, data });
        if (roleId) {
          await tx.userRole.deleteMany({ where: { userId } });
          await tx.userRole.create({ data: { userId, roleId } });
        }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A user with this email already exists.');
      }
      throw error;
    }

    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true, status: true, userRoles: { include: { role: { select: { id: true, name: true } } } } },
    });
  }

  async deleteUser(actorId: string, userId: string) {
    const companyId = await this.companyIdFor(actorId);
    const target = await this.prisma.user.findFirst({
      where: { id: userId, companyId },
      include: { userRoles: { include: { role: { select: { name: true } } } } },
    });
    if (!target) throw new NotFoundException('User not found in your company.');
    if (actorId === userId) throw new ForbiddenException('You cannot delete your own account.');

    const isAdmin = target.userRoles.some(({ role }) => role.name.toUpperCase() === 'ADMIN');
    if (isAdmin) {
      const activeAdmins = await this.prisma.user.count({
        where: { companyId, status: 'ACTIVE', userRoles: { some: { role: { name: 'ADMIN' } } } },
      });
      if (activeAdmins <= 1) throw new ForbiddenException('The last active administrator cannot be deleted.');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.userRole.deleteMany({ where: { userId } });
      await tx.user.delete({ where: { id: userId } });
    });
    return { success: true };
  }
  async myPermissions(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { userRoles: { include: { role: { include: { rolePerms: { include: { permission: true } } } } } } },
    });
    if (!user) throw new NotFoundException('Authenticated user not found.');
    if (user.userRoles.some(({ role }) => role.name.toUpperCase() === 'ADMIN')) return { permissions: ['*'] };
    const permissions = user.userRoles.flatMap(({ role }) => role.rolePerms.map(({ permission }) => permission.code));
    return { permissions: [...new Set(permissions)] };
  }

  async getRolePermissions(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { rolePerms: { include: { permission: true } } },
    });
    if (!role) throw new NotFoundException('Role not found.');
    return { permissions: role.rolePerms.map(({ permission }) => permission) };
  }

  async replaceRolePermissions(roleId: string, permissionIds: string[]) {
    if (!Array.isArray(permissionIds) || permissionIds.some((id) => typeof id !== 'string')) {
      throw new BadRequestException('permissionIds must be an array of permission IDs.');
    }
    const role = await this.prisma.role.findUnique({ where: { id: roleId }, select: { id: true } });
    if (!role) throw new NotFoundException('Role not found.');
    const uniqueIds = [...new Set(permissionIds)];
    const foundCount = uniqueIds.length
      ? await this.prisma.permission.count({ where: { id: { in: uniqueIds } } })
      : 0;
    if (foundCount !== uniqueIds.length) throw new BadRequestException('One or more permissions do not exist.');

    await this.prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({ where: { roleId } });
      if (uniqueIds.length) {
        await tx.rolePermission.createMany({
          data: uniqueIds.map((permissionId) => ({ roleId, permissionId })),
          skipDuplicates: true,
        });
      }
    });
    return { success: true };
  }

  async assignRole(actorId: string, userId: string, roleId: string) {
    const companyId = await this.companyIdFor(actorId);
    const [target, role] = await Promise.all([
      this.prisma.user.findFirst({ where: { id: userId, companyId }, select: { id: true } }),
      this.prisma.role.findUnique({ where: { id: roleId }, select: { id: true } }),
    ]);
    if (!target) throw new NotFoundException('User not found in your company.');
    if (!role) throw new NotFoundException('Role not found.');
    await this.prisma.$transaction(async (tx) => {
      await tx.userRole.deleteMany({ where: { userId } });
      await tx.userRole.create({ data: { userId, roleId } });
    });
    return { success: true };
  }

  private async companyIdFor(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { companyId: true } });
    if (!user) throw new NotFoundException('Authenticated user not found.');
    if (!user.companyId) throw new ForbiddenException('This account is not linked to a company.');
    return user.companyId;
  }
}
