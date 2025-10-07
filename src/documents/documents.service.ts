import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from 'src/entities/documents.entity';
import { IsNull, Not, Repository } from 'typeorm';
import {
  CreateDocumentDto,
  CreateDocumentSchema,
  UpdateDocumentDto,
  UpdateDocumentSchema,
} from './dto/document.dto';
import { ValidationService } from 'src/common/validation.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document) private readonly documentRepo: Repository<Document>,
    private readonly validation: ValidationService,
  ) {}

  // get all documents
  async getAllDocumentsService(): Promise<Document[]> {
    return this.documentRepo.find({
      relations: ['category', 'verifiedBy'],
      order: { id: 'DESC' },
    });
  }

  // get document by id
  async getDocumentByIdService(id: number): Promise<Document | null> {
    const doc = await this.documentRepo.findOne({
      where: { id },
      relations: ['category', 'verifiedBy'],
    });

    if (!doc) throw new NotFoundException(`Dokumen dengan ${id} tidak ditemukan`);

    return doc;
  }

  // create document
  async createDocumentService(data: CreateDocumentDto): Promise<Document> {
    const dto = this.validation.validate(CreateDocumentSchema, data);
    const { verifiedBy, categoryId, ...rest } = dto as CreateDocumentDto & {
      verifiedBy?: number | null;
      categoryId?: number | null;
    };

    const doc = this.documentRepo.create({
      ...(rest as Omit<CreateDocumentDto, 'verifiedBy' | 'categoryId'>),
      category: categoryId ? ({ id: categoryId } as unknown as Document['category']) : null,
      verifiedBy: verifiedBy ? ({ id: verifiedBy } as unknown as Document['verifiedBy']) : null,
    });

    return this.documentRepo.save(doc);
  }

  // update document by id
  async updateDocumentService(id: number, data: UpdateDocumentDto): Promise<Document> {
    const dto = this.validation.validate(UpdateDocumentSchema, data);
    const doc = await this.getDocumentByIdService(id);

    if (!doc) throw new NotFoundException(`Dokumen dengan id ${id} tidak ditemukan`);

    const { verifiedBy, categoryId, ...rest } = dto as UpdateDocumentDto & {
      verifiedBy?: number | null;
      categoryId?: number | null;
    };
    Object.assign(doc, rest);
    if (categoryId !== undefined) {
      doc.category = categoryId ? ({ id: categoryId } as unknown as Document['category']) : null;
    }
    if (verifiedBy !== undefined) {
      doc.verifiedBy = verifiedBy
        ? ({ id: verifiedBy } as unknown as Document['verifiedBy'])
        : null;
    }

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
    const docs = await this.documentRepo.find({
      withDeleted: true,
      where: { deletedAt: Not(IsNull()) },
      relations: ['category', 'verifiedBy'],
      order: { id: 'DESC' },
    });

    return docs;
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
}
