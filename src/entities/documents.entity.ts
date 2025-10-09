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
  subject?: string;

  @Column({ type: 'text', nullable: true })
  abstract?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  keywords?: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'verified', 'published', 'archived'],
    default: 'draft',
  })
  status: string;

  @ManyToOne(() => DocumentCategory, (cat) => cat.documents, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category?: DocumentCategory;

  @Column({ length: 150, nullable: true })
  publisher?: string;

  @Column({ length: 150, nullable: true })
  signed_by?: string;

  @Column({ type: 'date', nullable: true })
  date_signed?: Date;

  @Column({ type: 'date', nullable: true })
  effective_date?: Date;

  @Column({ length: 255, nullable: true })
  file_url?: string;

  @Column({ type: 'datetime', nullable: true })
  verification_date?: Date;

  @ManyToOne(() => User, (user) => user.verifiedDocuments, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'verified_by' })
  verified_by?: User;

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

  @OneToMany(() => DocumentVersion, (ver) => ver.document)
  versions: DocumentVersion[];
}
