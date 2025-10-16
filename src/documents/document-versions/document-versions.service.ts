import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull, ILike } from 'typeorm';
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

  // get all document versions with pagination or search
  async getAllDocumentVersionsPaginationService(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const where = search ? { notes: ILike(`%${search}%`) } : {};

    const [data, total] = await this.versionRepo.findAndCount({
      where,
      relations: ['document'],
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      last_page: Math.ceil(total / limit),
    };
  }

  // get all document versions
  async getAllDocumentVersionsService(): Promise<DocumentVersion[]> {
    return this.versionRepo.find({
      relations: ['document'],
      order: { created_at: 'DESC' },
    });
  }

  // get all document versions by document id
  async getAllDocumentVersionsByDocumentIdService(documentId: number): Promise<DocumentVersion[]> {
    const versions = await this.versionRepo.find({
      where: { document: { id: documentId } },
      relations: { document: true },
      order: { created_at: 'DESC' },
    });

    return versions;
  }

  // get document version by id
  async getDocumentVersionByIdService(id: number): Promise<DocumentVersion> {
    const version = await this.versionRepo.findOne({ where: { id }, relations: ['document'] });

    if (!version) throw new NotFoundException(`Versi dokumen dengan id ${id} tidak ditemukan`);

    return version;
  }

  // create document version
  async createDocumentVersionService(
    dto: CreateDocumentVersionDto,
    userId?: number,
  ): Promise<DocumentVersion> {
    const data = this.validation.validate(CreateDocumentVersionSchema, dto);
    const document = await this.documentRepo.findOne({ where: { id: data.document_id } });

    if (!document)
      throw new NotFoundException(`Dokumen dengan id ${data.document_id} tidak ditemukan`);

    const version = this.versionRepo.create({
      ...data,
      document,
      created_by: userId,
      updated_by: userId,
    });

    return this.versionRepo.save(version);
  }

  // alternatif: create spesifik di bawah document (inject documentId)
  async createDocumentVersionUnderDocumentService(
    documentId: number,
    dto: Omit<CreateDocumentVersionDto, 'documentId'>,
    userId?: number,
  ): Promise<DocumentVersion> {
    const document = await this.documentRepo.findOne({ where: { id: documentId } });

    if (!document) throw new NotFoundException(`Dokumen dengan id ${documentId} tidak ditemukan`);

    const data = this.validation.validate(CreateDocumentVersionSchema, {
      ...dto,
      documentId,
    } as CreateDocumentVersionDto);

    const version = this.versionRepo.create({
      ...data,
      document,
      created_by: userId,
      updated_by: userId,
    });

    return this.versionRepo.save(version);
  }

  // update document version by id
  async updateDocumentVersionService(
    id: number,
    data: UpdateDocumentVersionDto,
    userId?: number,
  ): Promise<DocumentVersion> {
    const dto = this.validation.validate(UpdateDocumentVersionSchema, data);
    const version = await this.getDocumentVersionByIdService(id);

    Object.assign(version, dto, {
      updated_by: userId,
    });

    return this.versionRepo.save(version);
  }

  // soft delete document version by id
  async deleteDocumentVersionByIdService(id: number, userId?: number): Promise<DocumentVersion> {
    const version = await this.getDocumentVersionByIdService(id);
    if (version.deleted_at)
      throw new NotFoundException(`Versi dokumen dengan id ${id} sudah dihapus`);

    version.deleted_by = userId;

    return this.versionRepo.softRemove(version);
  }

  // get all deleted document versions
  async getAllDeletedDocumentVersionsService(): Promise<DocumentVersion[]> {
    return this.versionRepo.find({
      withDeleted: true,
      where: { deleted_at: Not(IsNull()) },
      order: { version_number: 'DESC' },
    });
  }

  // restore soft deleted document version by id
  async restoreDeletedDocumentVersionByIdService(id: number): Promise<DocumentVersion> {
    const version = await this.versionRepo.findOne({
      withDeleted: true,
      where: { id, deleted_at: Not(IsNull()) },
    });

    if (!version)
      throw new NotFoundException(
        `Versi dokumen dengan id ${id} tidak ditemukan atau belum dihapus`,
      );
    if (!version.deleted_at)
      throw new NotFoundException(`Versi dokumen dengan id ${id} belum dihapus`);

    await this.versionRepo.restore(id);

    return this.getDocumentVersionByIdService(id);
  }
}
