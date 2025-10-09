import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Document } from './documents.entity';

@Entity('document_categories')
export class DocumentCategory {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

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

  @OneToMany(() => Document, (doc) => doc.category)
  documents: Document[];
}
