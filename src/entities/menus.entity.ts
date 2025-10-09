import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { RoleMenuPermission } from './role-menu-permissions.entity';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 150 })
  slug: string;

  @ManyToOne(() => Menu, (menu) => menu.children, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent?: Menu;

  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];

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

  @OneToMany(() => RoleMenuPermission, (rmp) => rmp.menu)
  permissions: RoleMenuPermission[];
}
