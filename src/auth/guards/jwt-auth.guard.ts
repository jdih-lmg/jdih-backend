import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

type MaybeInfo = { name?: string; message?: string } | undefined | null;

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // cek apakah route diberikan decorator @Public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: unknown, user: TUser, info: MaybeInfo): TUser {
    if (err || !user) {
      const infoName = info?.name;
      if (infoName === 'TokenExpiredError') {
        throw new UnauthorizedException('Token kedaluwarsa, silakan login kembali');
      }
      if (infoName === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token tidak valid');
      }
      if (err instanceof Error) {
        throw err;
      }
      throw new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}
