import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RoleMenuPermission } from './role-menu-permissions.entity';

@Entity('actions')
export class Action {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => RoleMenuPermission, (perm) => perm.action)
  permissions: RoleMenuPermission[];
}
