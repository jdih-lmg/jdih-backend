import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleMenuPermission } from 'src/entities/role-menu-permissions.entity';
import { Menu } from 'src/entities/menus.entity';
import { Action } from 'src/entities/actions.entity';
import { AuthUser } from '../auth-user.interface';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(RoleMenuPermission)
    private readonly permRepo: Repository<RoleMenuPermission>,
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
    @InjectRepository(Action)
    private readonly actionRepo: Repository<Action>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{ user: AuthUser }>();
    const user = req.user;

    const menuSlug = this.reflector.get<string>('menu', context.getHandler());
    const actionName = this.reflector.get<string>('action', context.getHandler());

    if (!menuSlug || !actionName) {
      throw new ForbiddenException('Permission metadata tidak lengkap');
    }
    if (!user) {
      throw new ForbiddenException('User tidak ditemukan pada konteks request');
    }

    // Admin bypass
    if (user.role.name === 'admin') return true;

    const menu = await this.menuRepo.findOne({ where: { slug: menuSlug } });
    const action = await this.actionRepo.findOne({ where: { name: actionName } });

    if (!menu || !action) {
      throw new ForbiddenException('Menu atau aksi tidak ditemukan');
    }

    const permission = await this.permRepo.findOne({
      where: {
        role: { id: user.role.id },
        menu: { id: menu.id },
        action: { id: action.id },
      },
    });

    const isDev = process.env.NODE_ENV !== 'production';
    if (!permission) {
      throw new ForbiddenException(
        isDev
          ? `Role "${user.role.name}" tidak memiliki izin ${actionName} pada menu "${menuSlug}"`
          : 'Anda tidak memiliki izin untuk melakukan aksi ini',
      );
    }

    return true;
  }
}
