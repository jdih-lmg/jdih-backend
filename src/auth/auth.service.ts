import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ValidationService } from 'src/common/validation.service';
import * as bcrypt from 'bcrypt';
import { LoginDto, LoginSchema } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly validation: ValidationService,
  ) {}

  // check validasi user dan password
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { email }, relations: ['role'] });
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return null;
    return user;
  }

  // login user
  async login(data: LoginDto): Promise<AuthResult> {
    // Normalisasi email (trim + lowercase) sebelum parsing zod
    const normalizedInput: LoginDto = {
      ...data,
      email: (data.email || '').trim().toLowerCase(),
      password: data.password,
    } as LoginDto;

    const dto = this.validation.validate(LoginSchema, normalizedInput);

    const user = await this.validateUser(dto.email, dto.password);

    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const payload = { sub: user.id, email: user.email, role: user.role ? user.role.name : null };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
          ? { id: user.role.id, name: user.role.name, description: user.role.description }
          : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}

export interface AuthResultUserRole {
  id: number;
  name: string;
  description?: string | null;
}

export interface AuthResultUser {
  id: number;
  name: string;
  email: string;
  role: AuthResultUserRole | null;
  createdAt: Date;
  updatedAt?: Date;
}

export interface AuthResult {
  token: string;
  user: AuthResultUser;
}
