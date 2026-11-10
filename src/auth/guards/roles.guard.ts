import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) return true;

    const user = context.switchToHttp().getRequest().jwtUser;
    const roles: string[] = user?.roles ?? (user?.role ? [user.role] : []);
    if (!required.some((role) => roles.some((userRole) => userRole.toLowerCase() === role.toLowerCase()))) {
      throw new ForbiddenException('Access denied.');
    }
    return true;
  }
}
