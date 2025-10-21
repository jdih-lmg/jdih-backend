import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthUser } from './auth-user.interface';

interface JwtPayload {
  sub: number;
  email: string;
  role?: {
    id: number;
    name: string;
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET', 'kunci_rahasia_jwt'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.authService.validateUser(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: {
        id: user.role?.id || 0,
        name: user.role?.name || '',
      },
    };
  }
}
