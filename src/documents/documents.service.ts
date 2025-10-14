import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Document } from 'src/entities/documents.entity';
import { DocumentCategory } from 'src/entities/document-categories.entity';
import {
  CreateDocumentDto,
  createDocumentSchema,
  UpdateDocumentDto,
  updateDocumentSchema,
} from './dto/document.dto';
import { ValidationService } from 'src/common/validation.service';
import { User } from 'src/entities/users.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document) private documentRepo: Repository<Document>,
    @InjectRepository(DocumentCategory) private categoryRepo: Repository<DocumentCategory>,
    @InjectRepository(User) private userRepo: Repository<User>,
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
  async createDocumentService(data: CreateDocumentDto, userId?: number): Promise<Document> {
    let category: DocumentCategory | null = null;
    let verifiedBy: User | null = null;

    const dto = this.validation.validate(createDocumentSchema, data);

    if (dto.category_id) {
      category = await this.categoryRepo.findOne({ where: { id: dto.category_id } });
    }

    if (dto.verified_by) {
      verifiedBy = await this.userRepo.findOne({ where: { id: dto.verified_by } });
    }

    const doc = this.documentRepo.create({
      ...dto,
      category,
      verified_by: verifiedBy,
      created_by: userId || null,
    });

    return this.documentRepo.save(doc);
  }

  // update document by id
  async updateDocumentByIdService(
    id: number,
    data: UpdateDocumentDto,
    userId?: number,
  ): Promise<Document> {
    const document = await this.getDocumentByIdService(id);

    if (data.category_id) {
      document.category = await this.categoryRepo.findOne({ where: { id: data.category_id } });
    }

    if (data.verified_by) {
      document.verified_by = await this.userRepo.findOne({ where: { id: data.verified_by } });
    }

    const dto = this.validation.validate(updateDocumentSchema, data);

    Object.assign(document, { ...dto, updated_by: userId || null });

    return this.documentRepo.save(document);
  }

  // delete document by id
  async deleteDocumentByIdService(id: number, userId?: number): Promise<Document> {
    const document = await this.getDocumentByIdService(id);

    document.deleted_by = userId || null;

    await this.documentRepo.save(document);
    await this.documentRepo.softDelete(id);

    return document;
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
