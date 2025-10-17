import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @ManyToOne(() => User, (user) => user.auditLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  user_id: number;

  @Column({ length: 100 })
  action: string;

  @Column({ length: 100 })
  entity: string;

  @Column({ type: 'bigint', unsigned: true })
  entity_id: number;

  @Column({ type: 'json', nullable: true })
  old_data?: object | null;

  @Column({ type: 'json', nullable: true })
  new_data?: object | null;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  created_at: Date;
}
