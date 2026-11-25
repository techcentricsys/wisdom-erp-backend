import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service.js';

/** Verifies the Bearer token, reloads the user from the DB (so deactivated users are cut off
 *  immediately) and puts it on request.accessUser. */
@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private readonly jwt: JwtService, private readonly prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const [scheme, token] = (req.headers.authorization ?? '').split(' ');
    if (scheme !== 'Bearer' || !token) throw new UnauthorizedException('Please log in.');
    let payload: any;
    try {
      payload = await this.jwt.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Session expired. Please log in again.');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { userRoles: { include: { role: true } } },
    });
    if (!user || user.status !== 'ACTIVE') throw new UnauthorizedException('Account is not active.');
    req.accessUser = user;
    return true;
  }
}

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const u = ctx.switchToHttp().getRequest().accessUser;
    if (u?.baseRole !== 'Super Admin') throw new ForbiddenException('Super Admin only.');
    return true;
  }
}
