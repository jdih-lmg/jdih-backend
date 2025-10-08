import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 150 })
  slug: string; // should align with route segment, e.g. "documents"

  @Column({ name: 'parent_id', type: 'bigint', unsigned: true, nullable: true })
  parentId?: number | null;

  @ManyToOne(() => Menu, (m) => m.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: Menu | null;

  @OneToMany(() => Menu, (m) => m.parent)
  children: Menu[];

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
