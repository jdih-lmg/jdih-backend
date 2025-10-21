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
import { AuthUser } from './auth-user.interface';
import { RoleMenuPermission } from 'src/entities/role-menu-permissions.entity';
import { Menu } from 'src/entities/menus.entity';
import { Action } from 'src/entities/actions.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(RoleMenuPermission)
    private readonly permissionRepo: Repository<RoleMenuPermission>,
    @InjectRepository(Menu) private readonly menuRepo: Repository<Menu>,
    @InjectRepository(Action) private readonly actionRepo: Repository<Action>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly validation: ValidationService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async validateUser(userId: number): Promise<AuthUser | null> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['role'],
    });
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: {
        id: user.role?.id ?? 0,
        name: user.role?.name ?? '',
      },
    };
  }

  async register(data: RegisterDto) {
    const dto = this.validation.validate(RegisterSchema, data);

    const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existingUser) throw new ConflictException('Email sudah terdaftar');

    const hashed = await bcrypt.hash(
      dto.password,
      Number(this.config.get('BCRYPT_SALT_ROUNDS')) || 10,
    );

    const defaultRole = await this.roleRepo.findOne({ where: { name: 'user' } });
    if (!defaultRole)
      throw new ConflictException('Role default tidak ditemukan, silakan hubungi admin');

    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password_hash: hashed,
      role: defaultRole,
    });

    await this.userRepo.save(user);
    const token = await this.signToken(user.id, user.email, user.role);

    return {
      message: 'Registrasi berhasil',
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: { id: defaultRole.id, name: defaultRole.name },
        access_token: token,
      },
    };
  }

  async login(data: LoginDto, req?: { ip?: string; headers?: { 'user-agent'?: string } }) {
    const normalizedInput: LoginDto = {
      ...data,
      email: (data.email || '').trim().toLowerCase(),
    };

    const dto = this.validation.validate(LoginSchema, normalizedInput);

    const user = await this.userRepo.findOne({ where: { email: dto.email }, relations: ['role'] });
    if (!user || !(await bcrypt.compare(dto.password, user.password_hash))) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const token = await this.signToken(user.id, user.email, user.role);

    await this.auditLogsService.logAction(
      { id: user.id },
      AuditAction.LOGIN,
      'Auth',
      user.id,
      null,
      {
        ip: req?.ip || null,
        user_agent: req?.headers?.['user-agent'] || null,
      },
    );

    return {
      message: 'Login berhasil',
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: { id: user.role?.id ?? 0, name: user.role?.name ?? '' },
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
      access_token: token,
    };
  }

  private async signToken(userId: number, email: string, role?: Role): Promise<string> {
    const payload = {
      sub: userId,
      email,
      role: role ? { id: role.id, name: role.name } : undefined,
    };
    return this.jwtService.signAsync(payload);
  }

  async logout(user: AuthUser, req: { ip?: string; headers?: { 'user-agent'?: string } }) {
    if (!user?.id) {
      throw new UnauthorizedException('token tidak valid atau user tidak ditemukan');
    }

    await this.auditLogsService.logAction(
      { id: user.id },
      AuditAction.LOGOUT,
      'Auth',
      user.id,
      null,
      {
        ip: req?.ip || null,
        user_agent: req?.headers?.['user-agent'] || null,
      },
    );

    return { message: 'Logout berhasil', success: true };
  }

  // get all users with permissions
  async getAllUsersWithPermissions() {
    const users = await this.userRepo.find({
      relations: ['role'],
      order: { id: 'ASC' },
    });

    const permissions = await this.permissionRepo.find({
      relations: ['role', 'menu', 'action'],
    });

    const rolePermissionMap = new Map<number, { [menu: string]: string[] }>();

    for (const p of permissions) {
      const roleId = p.role.id;

      if (!rolePermissionMap.has(roleId)) {
        rolePermissionMap.set(roleId, {});
      }

      const menuSlug = p.menu.slug;
      const actionName = p.action.name;
      const roleEntry = rolePermissionMap.get(roleId)!;

      if (!roleEntry[menuSlug]) {
        roleEntry[menuSlug] = [];
      }

      roleEntry[menuSlug].push(actionName);
    }

    // format hasil tiap user
    const result = users.map((user) => {
      const perms = user.role?.id ? rolePermissionMap.get(user.role.id) || {} : {};
      const formattedPerms = Object.entries(perms).map(([menu, actions]) => ({
        menu,
        actions,
      }));

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: {
          id: user.role?.id ?? 0,
          name: user.role?.name ?? '',
        },
        permissions: formattedPerms,
      };
    });

    return result;
  }
}
