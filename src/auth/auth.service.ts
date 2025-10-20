import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ValidationService } from 'src/common/validation.service';
import * as bcrypt from 'bcrypt';
import { LoginDto, LoginSchema } from './dto/login.dto';
import { RegisterDto, RegisterSchema } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/entities/roles.entity';
import { AuditAction, AuditLogsService } from 'src/audit-logs/audit-logs.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly validation: ValidationService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  // check validasi user dan password
  async validateUser(userId: number): Promise<User | null> {
    return this.userRepo.findOne({
      where: { id: userId },
      relations: ['role'],
    });
  }

  // register user
  async register(data: RegisterDto) {
    const dto = this.validation.validate(RegisterSchema, data);

    const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const hashed = await bcrypt.hash(
      dto.password,
      Number(this.config.get('BCRYPT_SALT_ROUNDS')) || 10,
    );

    const defaultRole = await this.roleRepo.findOne({ where: { name: 'user' } });

    if (!defaultRole) {
      throw new ConflictException('Role default tidak ditemukan, silakan hubungi admin');
    }

    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password_hash: hashed,
      role: defaultRole,
    });

    await this.userRepo.save(user);

    const token = await this.signToken(user.id, user.email);

    return {
      message: 'Registrasi berhasil',
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
          ? { id: user.role.id, name: user.role.name, description: user.role.description }
          : null,
        access_token: token,
      },
    };
  }

  // login user
  async login(data: LoginDto, req?: { ip?: string; headers?: { 'user-agent'?: string } }) {
    // Normalisasi email (trim + lowercase) sebelum parsing zod
    const normalizedInput: LoginDto = {
      ...data,
      email: (data.email || '').trim().toLowerCase(),
      password: data.password,
    } as LoginDto;

    const dto = this.validation.validate(LoginSchema, normalizedInput);

    const user = await this.userRepo.findOne({ where: { email: dto.email }, relations: ['role'] });

    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isValid = await bcrypt.compare(dto.password, user.password_hash);

    if (!isValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const token = await this.signToken(user.id, user.email);

    await this.auditLogsService.logAction(
      { id: user.id },
      AuditAction.LOGIN,
      'Auth',
      user.id,
      null,
      {
        ip: req?.ip || null,
        user_agent: (req?.headers?.['user-agent'] as string) || null,
      },
    );

    return {
      message: 'Login berhasil',
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
          ? { id: user.role.id, name: user.role.name, description: user.role.description }
          : null,
        createdAt: user.created_at,
        updatedAt: user.updated_at || undefined,
      },
      access_token: token,
    };
  }

  private async signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
      role: (await this.validateUser(userId))?.role?.name || null,
    };

    return this.jwtService.signAsync(payload);
  }

  // logout user
  async logout(user: any, req: { ip?: string; headers?: { 'user-agent'?: string } }) {
    if (
      !user ||
      typeof user !== 'object' ||
      !('userId' in user) ||
      !(user as { userId: number }).userId
    ) {
      throw new UnauthorizedException('token tidak valid atau user tidak ditemukan');
    }

    const typedUser = user as { userId: number };

    await this.auditLogsService.logAction(
      { id: typedUser.userId },
      AuditAction.LOGOUT,
      'Auth',
      typedUser.userId,
      null,
      {
        ip: req?.ip || null,
        user_agent: (req?.headers?.['user-agent'] as string) || null,
      },
    );

    return {
      message: 'Logout berhasil',
      success: true,
    };
  }
}
