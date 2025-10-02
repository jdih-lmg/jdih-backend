import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinColumn } from 'typeorm';
import { RoleMenuPermission } from './role-menu-permissions.entity';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 150 })
  slug: string;

  @ManyToMany(() => Menu, (menu) => menu.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: Menu;

  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];

  @OneToMany(() => RoleMenuPermission, (perm) => perm.menu)
  permissions: RoleMenuPermission[];
}
