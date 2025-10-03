/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/entity/role-menu-permissions.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Role } from './roles.entity';
import { Menu } from './menus.entity';
import { Action } from './actions.entity';

@Entity('role_menu_permissions')
export class RoleMenuPermission {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @ManyToOne(() => Role, (role) => role.permissions)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Menu, (menu) => menu.permissions)
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;

  @ManyToOne(() => Action, (action) => action.permissions)
  @JoinColumn({ name: 'action_id' })
  action: Action;

  @Column({ name: 'is_allowed', type: 'tinyint', default: 1 })
  isAllowed: boolean;
}
