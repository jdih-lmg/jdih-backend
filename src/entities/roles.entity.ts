import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './users.entity';
import { RoleMenuPermission } from './role-menu-permissions.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @OneToMany(() => RoleMenuPermission, (perm) => perm.role)
  permissions: RoleMenuPermission[];
}
