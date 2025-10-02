import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Document } from './documents.entity';

@Entity('document_versions')
export class DocumentVersion {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 50 })
  version: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  filePath?: string;

  @ManyToOne(() => Document, (doc) => doc.versions)
  @JoinColumn({ name: 'document_id' })
  document: Document;
}
