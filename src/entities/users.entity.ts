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
import { Role } from './roles.entity';
import { Document } from './documents.entity';
import { AuditLog } from './audit-logs.entity';
import { News } from './news.entity';
import { VisitorStat } from './visitor-stats.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 255 })
  password_hash: string;

  @ManyToOne(() => Role, (role) => role.users, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'role_id' })
  role?: Role;

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

  @OneToMany(() => Document, (doc) => doc.verified_by)
  verifiedDocuments: Document[];

  @OneToMany(() => AuditLog, (log) => log.user)
  auditLogs: AuditLog[];

  @OneToMany(() => News, (news) => news.author)
  news?: News[];

  @OneToMany(() => VisitorStat, (stat) => stat.user)
  visitorStats?: VisitorStat[];
}
