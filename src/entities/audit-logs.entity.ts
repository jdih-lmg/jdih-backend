import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './users.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 100 })
  action: string;

  @Column({ length: 100 })
  entity: string;

  @Column({ type: 'bigint', unsigned: true })
  entity_id: number;

  @Column({ type: 'json', nullable: true })
  old_data?: object;

  @Column({ type: 'json', nullable: true })
  new_data?: object;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
