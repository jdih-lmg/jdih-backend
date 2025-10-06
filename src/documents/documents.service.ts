import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentVersion } from 'src/entities/document-versions.entity';
import { Document } from 'src/entities/documents.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateDocumentDto, CreateDocumentSchema, UpdateDocumentDto } from './dto/document.dto';
import { ValidationService } from 'src/common/validation.service';
import {
  CreateDocumentVersionDto,
  CreateDocumentVersionSchema,
  UpdateDocumentVersionDto,
  UpdateDocumentVersionSchema,
} from './dto/document-version.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document) private readonly documentRepo: Repository<Document>,
    @InjectRepository(DocumentVersion) private readonly versionRepo: Repository<DocumentVersion>,
    private readonly validation: ValidationService,
  ) {}

  // -- Document --
  // get all documents
  async getAllDocumentsService(): Promise<Document[]> {
    return this.documentRepo.find({
      relations: ['versions', 'category', 'verifiedByUser'],
      order: { id: 'DESC' },
    });
  }

  // get document by id
  async getDocumentByIdService(id: number): Promise<Document | null> {
    const doc = await this.documentRepo.findOne({
      where: { id },
      relations: ['versions', 'category', 'verifiedByUser'],
    });

    if (!doc) throw new NotFoundException(`Dokumen dengan ${id} tidak ditemukan`);

    return doc;
  }

  // create document
  async createDocumentService(data: CreateDocumentDto): Promise<Document> {
    const dto = this.validation.validate(CreateDocumentSchema, data);
    const doc = this.documentRepo.create(dto);

    return this.documentRepo.save(doc);
  }

  // update document by id
  async updateDocumentService(id: number, data: UpdateDocumentDto): Promise<Document> {
    const dto = this.validation.validate(CreateDocumentSchema, data);
    const doc = await this.getDocumentByIdService(id);

    if (!doc) throw new NotFoundException(`Dokumen dengan id ${id} tidak ditemukan`);

    Object.assign(doc, dto);

    return this.documentRepo.save(doc);
  }

  // soft delete document by id
  async deleteDocumentByIdService(id: number): Promise<Document> {
    const doc = await this.getDocumentByIdService(id);

    if (!doc) throw new NotFoundException(`Dokumen dengan id ${id} tidak ditemukan`);

    return this.documentRepo.softRemove(doc);
  }

  // get all deleted documents
  async getAllDeletedDocumentsService(): Promise<Document[]> {
    return this.documentRepo.find({
      withDeleted: true,
      where: { deletedAt: Not(IsNull()) },
      relations: ['versions', 'category', 'verifiedByUser'],
      order: { id: 'DESC' },
    });
  }

  // restore soft deleted document by id
  async restoreDeletedDocumentByIdService(id: number): Promise<Document> {
    const doc = await this.documentRepo.findOne({
      withDeleted: true,
      where: { id, deletedAt: Not(IsNull()) },
    });

    if (!doc) throw new NotFoundException(`Dokumen dengan id ${id} tidak ditemukan`);
    if (!doc.deletedAt) throw new NotFoundException(`Dokumen dengan id ${id} belum dihapus`);

    await this.documentRepo.restore(id);

    const restored = await this.getDocumentByIdService(id);

    return restored!;
  }

  // -- Document Version --
  // get all document versions
  async getAllDocumentVersionsService(): Promise<DocumentVersion[]> {
    return this.versionRepo.find({
      relations: ['document'],
      order: { versionNumber: 'DESC' },
    });
  }

  // get document version by id
  async getDocumentVersionByIdService(id: number): Promise<DocumentVersion> {
    const version = await this.versionRepo.findOne({
      where: { id },
      relations: ['document'],
    });

    if (!version) throw new NotFoundException(`Versi dokumen dengan id ${id} tidak ditemukan`);

    return version;
  }

  // create document version
  async createDocumentVersionService(data: CreateDocumentVersionDto): Promise<DocumentVersion> {
    // cek apakah dokumen dengan documentId ada
    const doc = await this.documentRepo.findOne({ where: { id: data.documentId } });

    if (!doc) throw new NotFoundException(`Dokumen dengan id ${data.documentId} tidak ditemukan`);

    // buat versi dokumen baru
    const dto = this.validation.validate(CreateDocumentVersionSchema, data);
    const version = this.versionRepo.create(dto);

    return this.versionRepo.save(version);
  }

  // update document version by id
  async updateDocumentVersionService(
    id: number,
    data: UpdateDocumentVersionDto,
  ): Promise<DocumentVersion> {
    const dto = this.validation.validate(UpdateDocumentVersionSchema, data);
    const version = await this.getDocumentVersionByIdService(id);

    Object.assign(version, dto);

    return this.versionRepo.save(version);
  }

  // soft delete document version by id
  async deleteDocumentVersionByIdService(id: number): Promise<DocumentVersion> {
    const version = await this.getDocumentVersionByIdService(id);

    return this.versionRepo.softRemove(version);
  }

  // get all deleted document versions
  async getAllDeletedDocumentVersionsService(): Promise<DocumentVersion[]> {
    return this.versionRepo.find({
      withDeleted: true,
      where: { deletedAt: Not(IsNull()) },
      relations: ['document'],
      order: { versionNumber: 'DESC' },
    });
  }

  // restore soft deleted document version by id
  async restoreDeletedDocumentVersionByIdService(id: number): Promise<DocumentVersion> {
    const version = await this.versionRepo.findOne({
      withDeleted: true,
      where: { id, deletedAt: Not(IsNull()) },
    });

    if (!version)
      throw new NotFoundException(
        `Versi dokumen dengan id ${id} tidak ditemukan atau belum dihapus`,
      );
    if (!version.deletedAt)
      throw new NotFoundException(`Versi dokumen dengan id ${id} belum dihapus`);

    await this.versionRepo.restore(id);

    const restored = await this.getDocumentVersionByIdService(id);

    return restored;
  }
}
