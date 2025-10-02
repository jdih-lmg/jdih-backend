import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { DocumentCategory } from './document-categories.entity';
import { DocumentVersion } from './document-versions.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => DocumentCategory, (cat: DocumentCategory) => cat.documents as Document[])
  @JoinColumn({ name: 'category_id' })
  category: DocumentCategory;

  @OneToMany(() => DocumentVersion, (version: DocumentVersion) => version.document)
  versions: DocumentVersion[];
}
