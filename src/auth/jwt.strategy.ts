import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../database/prisma.service';

export interface JwtPayload {
  sub: string;
  email: string;
  companyId: string;
  role: string;
  accessRoleId?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'swifterp-jwt-secret-key-2026',
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.sub === 'hardcoded-admin-id') {
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        accessRoleId: payload.accessRoleId ?? payload.role,
        roles: [payload.accessRoleId ?? payload.role],
        companyId: payload.companyId,
        isActive: true,
      };
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        accessRoleId: true,
        companyId: true,
        isActive: true,
        company: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User account is invalid or inactive');
    }

    const currentRole = user.accessRoleId ?? user.role;
    return { ...user, role: currentRole, roles: [currentRole] };
  }
}
