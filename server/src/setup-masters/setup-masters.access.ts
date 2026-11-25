import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import {
  Action,
  BaseRole,
  normalizeCell,
  seedPermissions,
  SYSTEM_ROLE_IDS,
} from '../access/access-model.js';
import { SetupKind } from './dto.js';

export const KIND_TO_SCREEN: Record<SetupKind, string> = {
  department: 'Departments',
  designation: 'Designations',
  salesperson: 'Salesperson',
  commercialPerson: 'Commercial Person',
  manufacturer: 'Manufacturer',
  shippingAgent: 'Shipping Agent',
  bank: 'Bank',
  accountCategory: 'Account Category',
  origin: 'Origin (Country)',
  port: 'Port',
  incoterm: 'Incoterm',
  shippingMode: 'Shipping Mode',
  paymentTerm: 'Payment Term',
  currency: 'Currency',
  checklist: 'Checklist',
};

@Injectable()
export class SetupMastersAccess {
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

  canMaintainMasters(user: any): boolean {
    const baseRole = this.resolveBaseRole(user);
    if (baseRole === 'Super Admin') return true;
    return baseRole === 'Local Admin' && Boolean(user?.canCreateMaster);
  }

  async assertMasterPermission(
    user: any,
    screenLabel: string,
    action: Action,
    superOnly = false,
  ): Promise<void> {
    const baseRole = this.resolveBaseRole(user);
    if (baseRole === 'Super Admin') return;

    if (superOnly) {
      throw new ForbiddenException(
        `Only a Super Admin can access ${screenLabel}.`,
      );
    }

    if (
      ['create', 'edit', 'delete'].includes(action) &&
      !this.canMaintainMasters(user)
    ) {
      throw new ForbiddenException(
        'You do not have permission to maintain setup master records.',
      );
    }

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
}
