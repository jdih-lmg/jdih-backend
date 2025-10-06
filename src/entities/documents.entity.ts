import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { DocumentVersion } from './document-versions.entity';
import { DocumentCategory } from './document-categories.entity';
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

  // Explicit varchar type to avoid reflection fallback issues
  @Column({ type: 'varchar', length: 255, nullable: true })
  keywords?: string | null;

  @Column({
    type: 'enum',
    enum: ['draft', 'verified', 'published', 'archived'],
    default: 'draft',
  })
  status: 'draft' | 'verified' | 'published' | 'archived';

  @Column({ name: 'category_id', type: 'bigint', unsigned: true, nullable: true })
  categoryId?: number | null;

  @ManyToOne(() => DocumentCategory, (cat) => cat.documents, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category?: DocumentCategory | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  publisher?: string | null;

  @Column({ name: 'signed_by', type: 'varchar', length: 150, nullable: true })
  signedBy?: string | null;

  @Column({ name: 'date_signed', type: 'date', nullable: true })
  dateSigned?: Date | null;

  @Column({ name: 'effective_date', type: 'date', nullable: true })
  effectiveDate?: Date | null;

  @Column({ name: 'file_url', type: 'varchar', length: 255, nullable: true })
  fileUrl?: string | null;

  @Column({ name: 'verification_date', type: 'datetime', nullable: true })
  verificationDate?: Date | null;

  @Column({ name: 'verified_by', type: 'bigint', unsigned: true, nullable: true })
  verifiedBy?: number | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'verified_by' })
  verifiedByUser?: User | null;

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

  @OneToMany(() => DocumentVersion, (v) => v.document)
  versions: DocumentVersion[];
}
