import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { DocumentCategory } from './document-categories.entity';
import { DocumentVersion } from './document-versions.entity';
import { User } from './users.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 100 })
  number: string;

  @Column({ length: 100 })
  type: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'text', nullable: true })
  subject?: string | null;

  @Column({ type: 'text', nullable: true })
  abstract?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  keywords?: string | null;

  @Column({
    type: 'enum',
    enum: ['draft', 'verified', 'published', 'archived'],
    default: 'draft',
  })
  status: 'draft' | 'verified' | 'published' | 'archived';

  @ManyToOne(() => DocumentCategory, (category) => category.documents, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category?: DocumentCategory | null;

  @Column({ name: 'publisher', type: 'varchar', length: 150, nullable: true })
  publisher?: string | null;

  @Column({ name: 'signed_by', type: 'varchar', length: 150, nullable: true })
  signed_by?: string | null;

  @Column({ name: 'date_signed', type: 'date', nullable: true })
  dateSigned?: Date | null;

  @Column({ name: 'effective_date', type: 'date', nullable: true })
  effectiveDate?: Date | null;

  @Column({ name: 'file_url', type: 'varchar', length: 255, nullable: true })
  fileUrl?: string | null;

  @Column({ name: 'verification_date', type: 'datetime', nullable: true })
  verificationDate?: Date | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'verified_by' })
  verified_by?: User | null;

  @OneToMany(() => DocumentVersion, (version) => version.document)
  versions: DocumentVersion[];

  @CreateDateColumn({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
  created_at: Date;

  @Column({ name: 'created_by', type: 'bigint', unsigned: true, nullable: true })
  created_by?: number | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', nullable: true })
  updated_at?: Date | null;

  @Column({ name: 'updated_by', type: 'bigint', unsigned: true, nullable: true })
  updated_by?: number | null;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deleted_at?: Date | null;

  @Column({ name: 'deleted_by', type: 'bigint', unsigned: true, nullable: true })
  deleted_by?: number | null;
}
