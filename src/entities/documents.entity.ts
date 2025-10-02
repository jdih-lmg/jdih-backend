import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
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

  @Column({ type: 'varchar', length: 100 })
  type: string;

  @Column({ type: 'year' })
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
  status: 'draft' | 'verified' | 'published' | 'archived';

  @ManyToOne(() => DocumentCategory, (cat: DocumentCategory) => cat.documents as Document[])
  @JoinColumn({ name: 'category_id' })
  category?: DocumentCategory;

  @Column({ type: 'varchar', length: 150, nullable: true })
  publisher?: string;

  @Column({ name: 'date_signed', length: 100, nullable: true })
  signedBy?: string;

  @Column({ name: 'date_signed', type: 'date', nullable: true })
  dateSigned?: Date;

  @Column({ name: 'effective_date', type: 'date', nullable: true })
  effectiveDate?: Date;

  @Column({ name: 'file_url', type: 'varchar', length: 255, nullable: true })
  fileUrl?: string;

  @Column({ name: 'verification_date', type: 'datetime', nullable: true })
  verificationDate?: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'verified_by' })
  verifiedBy?: User;

  @OneToMany(() => DocumentVersion, (version: DocumentVersion) => version.document)
  versions: DocumentVersion[];
}
