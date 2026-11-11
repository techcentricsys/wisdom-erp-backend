import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [scheme, token] = (request.headers.authorization ?? '').split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('No authentication token provided.');
    }
try {
  request.jwtUser = await this.jwt.verifyAsync(token);
  return true;
} catch (error) {
  console.error('JWT verification error:', error);
  throw new UnauthorizedException('Invalid or expired token.');
}
  }
}
