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
import { Menu } from './menus.entity';
import { Action } from './actions.entity';

@Entity('role_menu_permissions')
export class RoleMenuPermission {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'role_id', type: 'bigint', unsigned: true })
  roleId: number; // expect from JWT: user.roleId

  @Column({ name: 'menu_id', type: 'bigint', unsigned: true })
  menuId: number;

  @ManyToOne(() => Menu, { nullable: false })
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;

  @Column({ name: 'action_id', type: 'bigint', unsigned: true })
  actionId: number;

  @ManyToOne(() => Action, { nullable: false })
  @JoinColumn({ name: 'action_id' })
  action: Action;

  @Column({ name: 'is_allowed', type: 'tinyint', width: 1, default: 1 })
  isAllowed: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @Column({ name: 'created_by', type: 'bigint', unsigned: true, nullable: true })
  createdBy?: number | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', nullable: true })
  updatedAt?: Date | null;

  @Column({ name: 'updated_by', type: 'bigint', unsigned: true, nullable: true })
  updatedBy?: number | null;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt?: Date | null;

  @Column({ name: 'deleted_by', type: 'bigint', unsigned: true, nullable: true })
  deletedBy?: number | null;
}
