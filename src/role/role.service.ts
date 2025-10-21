import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from 'src/entities/actions.entity';
import { Menu } from 'src/entities/menus.entity';
import { RoleMenuPermission } from 'src/entities/role-menu-permissions.entity';
import { Role } from 'src/entities/roles.entity';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(RoleMenuPermission)
    private readonly permissionRepo: Repository<RoleMenuPermission>,
    @InjectRepository(Menu) private readonly menuRepo: Repository<Menu>,
    @InjectRepository(Action) private readonly actionRepo: Repository<Action>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  // get all roles with permissions
  async getAllRolesWithPermissions() {
    const roles = await this.roleRepo.find({ order: { id: 'ASC' } });
    const permisions = await this.permissionRepo.find({ relations: ['role', 'menu', 'action'] });

    return roles.map((role) => {
      const grouped: Record<string, string[]> = {};

      for (const p of permisions.filter((perm) => perm.role.id === role.id)) {
        const slug = p.menu.slug;

        if (!grouped[slug]) grouped[slug] = [];

        grouped[slug].push(p.action.name);
      }

      return {
        ...role,
        permissions: Object.entries(grouped).map(([menu, actions]) => ({
          menu,
          actions,
        })),
      };
    });
  }

  // update izin role
  async updateRolePermissions(roleId: number, permissions: { menu: string; actions: string[] }[]) {
    const role = await this.roleRepo.findOne({ where: { id: roleId } });

    if (!role) throw new NotFoundException('Role tidak ditemukan');

    // hapus izin lama
    await this.permissionRepo.delete({ role: { id: roleId } });

    // simpan izin baru
    const newPerms: RoleMenuPermission[] = [];

    for (const perm of permissions) {
      const menu = await this.menuRepo.findOne({ where: { slug: perm.menu } });
      if (!menu) continue;

      for (const actionName of perm.actions) {
        const action = await this.actionRepo.findOne({ where: { name: actionName } });
        if (!action) continue;

        const perm = this.permissionRepo.create({ role, menu, action });
        newPerms.push(perm);
      }
    }

    await this.permissionRepo.save(newPerms);

    return { role: role.name, total_permissions: newPerms.length };
  }

  // update role user
  async updateRoleUser(userId: number, roleId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    const role = await this.roleRepo.findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Role tidak ditemukan');

    user.role = role;

    await this.userRepo.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      new_role: role.name,
    };
  }
}
