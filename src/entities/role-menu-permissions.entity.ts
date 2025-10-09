import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from './roles.entity';
import { Menu } from './menus.entity';
import { Action } from './actions.entity';

@Entity('role_menu_permissions')
export class RoleMenuPermission {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @ManyToOne(() => Role, (role) => role.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Menu, (menu) => menu.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;

  @ManyToOne(() => Action, (action) => action.permissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'action_id' })
  action: Action;

  @Column({ type: 'tinyint', default: 1 })
  is_allowed: boolean;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  created_by?: number;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updated_at?: Date;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  updated_by?: number;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deleted_at?: Date;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  deleted_by?: number;
}
