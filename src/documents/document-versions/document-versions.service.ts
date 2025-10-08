import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { DocumentVersion } from 'src/entities/document-versions.entity';
import { Document } from 'src/entities/documents.entity';
import { ValidationService } from 'src/common/validation.service';
import {
  CreateDocumentVersionDto,
  CreateDocumentVersionSchema,
  UpdateDocumentVersionDto,
  UpdateDocumentVersionSchema,
} from '../dto/document-version.dto';

@Injectable()
export class DocumentVersionsService {
  constructor(
    @InjectRepository(DocumentVersion) private readonly versionRepo: Repository<DocumentVersion>,
    @InjectRepository(Document) private readonly documentRepo: Repository<Document>,
    private readonly validation: ValidationService,
  ) {}

  // get all document versions
  async getAllDocumentVersionsService(): Promise<DocumentVersion[]> {
    return this.versionRepo.find({ order: { versionNumber: 'DESC' } });
  }

  // get all document versions by document id
  async getAllDocumentVersionsByDocumentIdService(documentId: number): Promise<DocumentVersion[]> {
    const doc = await this.documentRepo.findOne({ where: { id: documentId } });

    if (!doc) throw new NotFoundException(`Dokumen dengan id ${documentId} tidak ditemukan`);

    return this.versionRepo.find({ where: { documentId }, order: { versionNumber: 'DESC' } });
  }

  // get document version by id
  async getDocumentVersionByIdService(id: number): Promise<DocumentVersion> {
    const version = await this.versionRepo.findOne({ where: { id } });

    if (!version) throw new NotFoundException(`Versi dokumen dengan id ${id} tidak ditemukan`);

    return version;
  }

  // create document version
  async createDocumentVersionService(data: CreateDocumentVersionDto): Promise<DocumentVersion> {
    const doc = await this.documentRepo.findOne({ where: { id: data.documentId } });

    if (!doc) throw new NotFoundException(`Dokumen dengan id ${data.documentId} tidak ditemukan`);

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

    return this.getDocumentVersionByIdService(id);
  }
}
