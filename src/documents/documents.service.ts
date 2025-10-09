import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Document } from 'src/entities/documents.entity';
import { DocumentVersion } from 'src/entities/document-versions.entity';
import { DocumentCategory } from 'src/entities/document-categories.entity';
import {
  CreateDocumentDto,
  createDocumentSchema,
  UpdateDocumentDto,
  updateDocumentSchema,
} from './dto/document.dto';
import { ValidationService } from 'src/common/validation.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document) private documentRepo: Repository<Document>,
    @InjectRepository(DocumentVersion) private versionRepo: Repository<DocumentVersion>,
    @InjectRepository(DocumentCategory) private categoryRepo: Repository<DocumentCategory>,
    private readonly validation: ValidationService,
  ) {}

  // get all documents
  async getAllDocumentsService(): Promise<Document[]> {
    return this.documentRepo.find({
      relations: ['category', 'verified_by', 'versions'],
      order: { created_at: 'DESC' },
    });
  }

  // get document by id
  async getDocumentByIdService(id: number): Promise<Document> {
    const doc = await this.documentRepo.findOne({
      where: { id },
      relations: ['category', 'verified_by', 'versions'],
    });

    if (!doc) throw new NotFoundException(`Document dengan id ${id} tidak ditemukan`);

    return doc;
  }

  // create document
  async createDocumentService(data: CreateDocumentDto): Promise<Document> {
    const dto = this.validation.validate(createDocumentSchema, data);

    const category = data.category_id
      ? await this.categoryRepo.findOne({ where: { id: data.category_id } })
      : null;

    const doc = this.documentRepo.create({
      ...dto,
      category: category ?? undefined,
    });

    return this.documentRepo.save(doc);
  }

  // update document by id
  async updateDocumentByIdService(id: number, data: UpdateDocumentDto): Promise<Document> {
    const dto = this.validation.validate(updateDocumentSchema, data);
    const doc = await this.getDocumentByIdService(id);

    Object.assign(doc, dto);

    return this.documentRepo.save(doc);
  }

  // delete document by id
  async deleteDocumentByIdService(id: number): Promise<Document> {
    const doc = await this.getDocumentByIdService(id);

    await this.documentRepo.softRemove(doc);

    return doc;
  }

  // get all deleted document
  async getAllDeletedDocumentsService(): Promise<Document[]> {
    return this.documentRepo.find({
      withDeleted: true,
      where: { deleted_at: Not(IsNull()) },
      relations: ['category', 'verified_by', 'versions'],
      order: { created_at: 'DESC' },
    });
  }

  // restore deleted document by id
  async restoreDeletedDocumentByIdService(id: number): Promise<Document> {
    const doc = await this.documentRepo.findOne({
      where: { id },
      withDeleted: true,
      relations: ['category', 'verified_by', 'versions'],
    });

    if (!doc) throw new NotFoundException(`Document dengan id ${id} tidak ditemukan`);
    if (!doc.deleted_at) {
      throw new NotFoundException(`Document dengan id ${id} tidak dalam status terhapus`);
    }

    await this.documentRepo.restore(id);

    return this.getDocumentByIdService(id);
  }
}
