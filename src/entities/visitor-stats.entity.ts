import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('visitor_stats')
export class VisitorStat {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ length: 45 })
  ip_address: string;

  @Column({ type: 'text', nullable: true })
  user_agent?: string;

  @CreateDateColumn({ name: 'visited_at' })
  visited_at: Date;
}
