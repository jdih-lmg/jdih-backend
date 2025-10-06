import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

type MaybeInfo = { name?: string; message?: string } | undefined | null;

export class JwtAuthGuard extends AuthGuard('jwt') {
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
