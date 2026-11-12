import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../database/prisma.service.js';
import {
  ALL_SCREENS, BASE_ROLES, BaseRole, CUSTOM_BASE_ROLES, SYSTEM_ROLE_IDS, ACTIONS,
  Matrix, normalizePermissions, seedPermissions,
} from './access-model.js';

const MAX_FAILS = 5;
const LOCK_MS = 60_000;
const ROLE_NAME_MAX = 40;
const cap = (s: string) => s.trim().replace(/\s+/g, ' ');

@Injectable()
export class AccessService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  /* ---------- start-up seed: 3 system roles + first Super Admin ---------- */
  async onModuleInit() {
    for (const base of BASE_ROLES) {
      const id = SYSTEM_ROLE_IDS[base];
      const role = await this.prisma.role.upsert({
        where: { id },
        update: { isSystem: true, baseRole: base },
        create: { id, name: base, description: `${base} (system role)`, baseRole: base, isSystem: true },
      });
      const have = await this.prisma.roleScreenPermission.count({ where: { roleId: role.id } });
      if (have === 0) await this.writeMatrix(role.id, seedPermissions(base));
    }
    const email = process.env.SEED_ADMIN_EMAIL?.toLowerCase();
    const password = process.env.SEED_ADMIN_PASSWORD;
    if (email && password && !(await this.prisma.user.findUnique({ where: { email } }))) {
      await this.createUserRow({ name: 'Administrator', email, password, role: 'Super Admin' });
      console.log(`[access] Seeded Super Admin ${email}`);
    }
  }

  /* ---------- helpers ---------- */
  private async writeMatrix(roleId: string, m: Matrix) {
    await this.prisma.$transaction([
      this.prisma.roleScreenPermission.deleteMany({ where: { roleId } }),
      this.prisma.roleScreenPermission.createMany({
        data: ALL_SCREENS.map((s) => ({
          roleId, screenLabel: s.label,
          canAccess: m[s.label].access, canView: m[s.label].view, canCreate: m[s.label].create,
          canEdit: m[s.label].edit, canDelete: m[s.label].delete,
        })),
      }),
    ]);
  }

  private async matrixOf(roleId: string, baseRole: BaseRole): Promise<Matrix> {
    const rows = await this.prisma.roleScreenPermission.findMany({ where: { roleId } });
    const raw: Record<string, any> = {};
    for (const r of rows) raw[r.screenLabel] = { access: r.canAccess, view: r.canView, create: r.canCreate, edit: r.canEdit, delete: r.canDelete };
    return normalizePermissions(raw, baseRole);
  }

  private publicUser(u: any, roleName?: string) {
    const link = u.userRoles?.[0];
    return {
      id: u.id,
      name: `${u.firstName} ${u.lastName}`.trim(),
      email: u.email,
      role: u.baseRole,
      roleId: link?.roleId ?? SYSTEM_ROLE_IDS[u.baseRole as BaseRole],
      roleName,
      department: u.department ?? '',
      designation: u.designation ?? '',
      managerId: u.managerId ?? null,
      canCreateMaster: u.canCreateMaster,
      status: u.status === 'ACTIVE' ? 'Active' : 'Inactive',
      lastLoginAt: u.lastLoginAt,
    };
  }

  private async withRoleNames(users: any[]) {
    const roles = await this.prisma.role.findMany();
    const names = new Map<string, string>(roles.map((r: any) => [r.id, r.name] as [string, string]));
    return users.map((u) => {
      const rid = u.userRoles?.[0]?.roleId ?? SYSTEM_ROLE_IDS[u.baseRole as BaseRole];
      return this.publicUser(u, names.get(rid));
    });
  }

  private splitName(name: string) {
    const parts = cap(name).split(' ');
    return { firstName: parts[0], lastName: parts.slice(1).join(' ') || '-' };
  }

  /** Resolve roleId / base role name to a Role row. */
  private async resolveRole(roleId?: string, base?: string) {
    const id = roleId ?? (base ? SYSTEM_ROLE_IDS[base as BaseRole] : SYSTEM_ROLE_IDS['Local User']);
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new BadRequestException('Role not found.');
    return role;
  }

  private async createUserRow(d: { name: string; email: string; password: string; role?: string; roleId?: string; department?: string; designation?: string; managerId?: string; canCreateMaster?: boolean }) {
    const email = d.email.toLowerCase();
    if (await this.prisma.user.findUnique({ where: { email } })) throw new ConflictException('Email already registered.');
    const role = await this.resolveRole(d.roleId, d.role);
    if (d.managerId && !(await this.prisma.user.findUnique({ where: { id: d.managerId } }))) throw new BadRequestException('Manager not found.');
    const { firstName, lastName } = this.splitName(d.name);
    const user = await this.prisma.user.create({
      data: {
        email, firstName, lastName,
        passwordHash: await bcrypt.hash(d.password, 10),
        baseRole: role.baseRole,
        department: d.department || null, designation: d.designation || null,
        managerId: d.managerId || null, canCreateMaster: !!d.canCreateMaster,
        userRoles: { create: { roleId: role.id } },
      },
      include: { userRoles: true },
    });
    return user;
  }

  /* ---------- auth ---------- */
  async register(d: { name: string; email: string; password: string }) {
    // public sign-up always creates the lowest role; an admin promotes later
    const user = await this.createUserRow({ ...d, role: 'Local User' });
    return this.session(user);
  }

  async login(d: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: d.email.toLowerCase() }, include: { userRoles: true } });
    const bad = new UnauthorizedException('Invalid email or password.');
    if (!user || !user.passwordHash) throw bad;
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const s = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 1000);
      throw new ForbiddenException(`Too many attempts. Try again in ${s}s.`);
    }
    if (!(await bcrypt.compare(d.password, user.passwordHash))) {
      const fails = user.failedLogins + 1;
      await this.prisma.user.update({
        where: { id: user.id },
        data: fails >= MAX_FAILS ? { failedLogins: 0, lockedUntil: new Date(Date.now() + LOCK_MS) } : { failedLogins: fails },
      });
      throw bad;
    }
    if (user.status !== 'ACTIVE') throw new ForbiddenException('Account is inactive. Contact your administrator.');
    const fresh = await this.prisma.user.update({ where: { id: user.id }, data: { failedLogins: 0, lockedUntil: null, lastLoginAt: new Date() }, include: { userRoles: true } });
    return this.session(fresh);
  }

  private async session(user: any) {
    const token = await this.jwt.signAsync({ sub: user.id, email: user.email, role: user.baseRole }, { expiresIn: '8h' });
    return { token, ...(await this.me(user)) };
  }

  /** current user + their permission matrix */
  async me(user: any) {
    const [pub] = await this.withRoleNames([user]);
    const roleId = pub.roleId;
    return { user: pub, permissions: await this.matrixOf(roleId, user.baseRole) };
  }

  async changePassword(user: any, d: { current: string; next: string }) {
    if (!user.passwordHash || !(await bcrypt.compare(d.current, user.passwordHash))) throw new BadRequestException('Current password is wrong.');
    await this.prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(d.next, 10) } });
    return { ok: true };
  }

  /* ---------- users (Super Admin) ---------- */
  async listUsers() {
    return this.withRoleNames(await this.prisma.user.findMany({ include: { userRoles: true }, orderBy: { createdAt: 'asc' } }));
  }

  async createUser(d: any) {
    const u = await this.createUserRow(d);
    return (await this.withRoleNames([u]))[0];
  }

  async updateUser(actor: any, id: string, d: any) {
    const target = await this.prisma.user.findUnique({ where: { id }, include: { userRoles: true } });
    if (!target) throw new NotFoundException('User not found.');
    const data: any = {};
    if (d.name !== undefined) Object.assign(data, this.splitName(d.name));
    if (d.department !== undefined) data.department = d.department || null;
    if (d.designation !== undefined) data.designation = d.designation || null;
    if (d.canCreateMaster !== undefined) data.canCreateMaster = d.canCreateMaster;
    if (d.managerId !== undefined) {
      if (d.managerId === id) throw new BadRequestException('A user cannot report to themselves.');
      data.managerId = d.managerId || null;
    }
    if (d.status !== undefined) {
      if (id === actor.id && d.status === 'Inactive') throw new BadRequestException('You cannot deactivate yourself.');
      data.status = d.status === 'Active' ? 'ACTIVE' : 'INACTIVE';
    }
    let newRole: any = null;
    if (d.roleId !== undefined || d.role !== undefined) {
      newRole = await this.resolveRole(d.roleId, d.role);
      if (id === actor.id && newRole.baseRole !== 'Super Admin') throw new BadRequestException('You cannot remove your own Super Admin role.');
      data.baseRole = newRole.baseRole;
    }
    if (data.baseRole === undefined && data.status === 'INACTIVE' && target.baseRole === 'Super Admin') {
      const others = await this.prisma.user.count({ where: { baseRole: 'Super Admin', status: 'ACTIVE', id: { not: id } } });
      if (!others) throw new BadRequestException('At least one active Super Admin is required.');
    }
    await this.prisma.user.update({ where: { id }, data });
    if (newRole) {
      await this.prisma.userRole.deleteMany({ where: { userId: id } });
      await this.prisma.userRole.create({ data: { userId: id, roleId: newRole.id } });
    }
    return (await this.withRoleNames([await this.prisma.user.findUniqueOrThrow({ where: { id }, include: { userRoles: true } })]))[0];
  }

  /* ---------- roles (Super Admin) ---------- */
  async listRoles() {
    const roles = await this.prisma.role.findMany({ orderBy: [{ isSystem: 'desc' }, { createdAt: 'asc' }], include: { userRoles: true } });
    const out = [];
    for (const r of roles) {
      out.push({
        id: r.id, name: r.name, baseRole: r.baseRole, isSystem: r.isSystem,
        memberCount: r.userRoles.length,
        permissions: await this.matrixOf(r.id, r.baseRole as BaseRole),
      });
    }
    return out;
  }

  async createRole(d: { name: string; baseRole: string; copyFromId?: string }) {
    const name = cap(d.name);
    if (!name) throw new BadRequestException('Role name is required.');
    if (name.length > ROLE_NAME_MAX) throw new BadRequestException(`Role name max ${ROLE_NAME_MAX} characters.`);
    if (!CUSTOM_BASE_ROLES.includes(d.baseRole as BaseRole)) throw new BadRequestException('Base role must be Local Admin or Local User.');
    if (await this.prisma.role.findFirst({ where: { name: { equals: name, mode: 'insensitive' } } })) throw new ConflictException('A role with this name already exists.');
    let start: Matrix;
    if (d.copyFromId) {
      const src = await this.prisma.role.findUnique({ where: { id: d.copyFromId } });
      if (!src) throw new BadRequestException('Role to copy was not found.');
      start = normalizePermissions(await this.matrixOf(src.id, src.baseRole as BaseRole), d.baseRole as BaseRole);
    } else start = seedPermissions(d.baseRole as BaseRole);
    const role = await this.prisma.role.create({ data: { name, baseRole: d.baseRole, isSystem: false } });
    await this.writeMatrix(role.id, start);
    return (await this.listRoles()).find((r) => r.id === role.id);
  }

  async savePermissions(id: string, perms: Record<string, Record<string, boolean>>) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException('Role not found.');
    if (role.baseRole === 'Super Admin') throw new ForbiddenException('Super Admin permissions cannot be changed.');
    for (const [label, cell] of Object.entries(perms)) {
      if (!ALL_SCREENS.some((s) => s.label === label)) throw new BadRequestException(`Unknown screen: ${label}`);
      for (const k of Object.keys(cell)) if (!(ACTIONS as readonly string[]).includes(k)) throw new BadRequestException(`Unknown action: ${k}`);
    }
    await this.writeMatrix(id, normalizePermissions(perms, role.baseRole as BaseRole));
    return (await this.listRoles()).find((r) => r.id === id);
  }

  async deleteRole(id: string) {
    const role = await this.prisma.role.findUnique({ where: { id }, include: { userRoles: true } });
    if (!role) throw new NotFoundException('Role not found.');
    if (role.isSystem) throw new ForbiddenException('System roles cannot be deleted.');
    if (role.userRoles.length) throw new BadRequestException('Role is still assigned to users. Move them first.');
    await this.prisma.role.delete({ where: { id } });
    return { ok: true };
  }
}
