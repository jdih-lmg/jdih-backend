// src/entity/document-versions.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Document } from './documents.entity';

@Entity('document_versions')
export class DocumentVersion {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @ManyToOne(() => Document, (doc) => doc.versions)
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @Column({ name: 'version_number', type: 'int' })
  versionNumber: number;

  @Column({ name: 'file_url', length: 255, nullable: true })
  fileUrl?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
