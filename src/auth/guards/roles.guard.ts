import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // tidak ada role yang dibatasi, semua boleh akses
    }

    const request = context.switchToHttp().getRequest<{ user?: { role?: string } }>();
    const { user } = request;

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.role || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Forbidden: role tidak sesuai');
    }

    return true;
  }
}
