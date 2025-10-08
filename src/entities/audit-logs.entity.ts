import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: number;

  @Column({ length: 100 })
  action: string;

  @Column({ length: 100 })
  entity: string;

  @Column({ name: 'entity_id', type: 'bigint', unsigned: true })
  entityId: number;

  @Column({ name: 'old_data', type: 'json', nullable: true })
  oldData?: Record<string, any> | null;

  @Column({ name: 'new_data', type: 'json', nullable: true })
  newData?: Record<string, any> | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;
}
