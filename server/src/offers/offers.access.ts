import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import {
  Action,
  BaseRole,
  normalizeCell,
  seedPermissions,
  SYSTEM_ROLE_IDS,
} from '../access/access-model.js';

@Injectable()
export class OffersAccess {
  constructor(private readonly prisma: PrismaService) {}

  resolveBaseRole(user: any): BaseRole {
    if (user?.baseRole === 'Super Admin') return 'Super Admin';
    const roles: any[] = user?.userRoles ?? [];
    if (
      roles.some(
        (ur) =>
          ur?.roleId === SYSTEM_ROLE_IDS['Super Admin'] ||
          ['ADMIN', 'SUPER ADMIN'].includes(
            String(ur?.role?.name ?? '').trim().toUpperCase(),
          ),
      )
    ) {
      return 'Super Admin';
    }
    if (
      user?.baseRole === 'Local Admin' ||
      roles.some((ur) => ur?.role?.baseRole === 'Local Admin')
    ) {
      return 'Local Admin';
    }
    return 'Local User';
  }

  canApproveOffers(user: any): boolean {
    const baseRole = this.resolveBaseRole(user);
    return baseRole === 'Super Admin' || baseRole === 'Local Admin';
  }

  async assertScreenPermission(
    user: any,
    screenLabel: string,
    action: Action,
  ): Promise<void> {
    const baseRole = this.resolveBaseRole(user);
    if (baseRole === 'Super Admin') return;

    const roleId =
      user?.userRoles?.[0]?.roleId ?? SYSTEM_ROLE_IDS[baseRole];

    const row = await this.prisma.roleScreenPermission.findUnique({
      where: {
        roleId_screenLabel: { roleId, screenLabel },
      },
    });

    const rawCell = row
      ? {
          access: row.canAccess,
          view: row.canView,
          create: row.canCreate,
          edit: row.canEdit,
          delete: row.canDelete,
        }
      : seedPermissions(baseRole)[screenLabel];

    const cell = normalizeCell(rawCell, screenLabel, baseRole);
    if (!cell.access || !cell[action]) {
      throw new ForbiddenException(
        `Access denied: missing '${action}' permission for ${screenLabel}.`,
      );
    }
  }

  async assertCanApproveOffers(user: any): Promise<void> {
    if (!this.canApproveOffers(user)) {
      throw new ForbiddenException(
        'Only Super Admin or Local Admin can approve or reject offers.',
      );
    }
    await this.assertScreenPermission(user, 'Offer Status', 'edit');
  }

  async resolveScopeUserIds(user: any): Promise<string[] | null> {
    const baseRole = this.resolveBaseRole(user);
    if (baseRole === 'Super Admin') return null;
    if (baseRole === 'Local User') return [user.id];

    const allUsers = await this.prisma.user.findMany({
      select: { id: true, managerId: true },
    });

    const team = new Set<string>([user.id]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const u of allUsers) {
        if (u.managerId && team.has(u.managerId) && !team.has(u.id)) {
          team.add(u.id);
          changed = true;
        }
      }
    }

    return Array.from(team);
  }

  async assertRecordOwnership(
    user: any,
    createdBy?: string | null,
  ): Promise<void> {
    const scopeIds = await this.resolveScopeUserIds(user);
    if (scopeIds === null) return;
    if (!createdBy || !scopeIds.includes(createdBy)) {
      throw new ForbiddenException(
        'You do not have access to this offer record.',
      );
    }
  }
}
