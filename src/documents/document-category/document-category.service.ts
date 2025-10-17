import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationService } from 'src/common/validation.service';
import { DocumentCategory } from 'src/entities/document-categories.entity';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import {
  CreateDocumentCategoryDto,
  CreateDocumentCategorySchema,
  UpdateDocumentCategoryDto,
  UpdateDocumentCategorySchema,
} from '../dto/document-category.dto';
import { AuditAction, AuditLogsService } from 'src/audit-logs/audit-logs.service';

@Injectable()
export class DocumentCategoryService {
  constructor(
    @InjectRepository(DocumentCategory) private readonly categoryRepo: Repository<DocumentCategory>,
    private readonly auditLogsService: AuditLogsService,
    private readonly validation: ValidationService,
  ) {}

  // get all document categories (pagination + search)
  async getAllDocumentCategoriesPaginationService(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where = search ? { name: ILike(`%${search}%`) } : {};

    const [data, total] = await this.categoryRepo.findAndCount({
      where,
      skip,
      take: limit,
      order: { created_at: 'DESC' },
      withDeleted: false,
    });

    return {
      data,
      total,
      page,
      last_page: Math.ceil(total / limit) || 1,
    };
  }

  // get all document categories
  async getAllDocumentCategoriesService(): Promise<DocumentCategory[]> {
    return this.categoryRepo.find({ order: { id: 'ASC' } });
  }

  // get document category by id
  async getDocumentCategoryByIdService(id: number): Promise<DocumentCategory | null> {
    const category = await this.categoryRepo.findOne({ where: { id } });

    if (!category) throw new NotFoundException(`Kategori dokumen dengan id ${id} tidak ditemukan`);

    return category;
  }

  // create document category
  async createDocumentCategoryService(
    data: CreateDocumentCategoryDto,
    userId?: number,
  ): Promise<DocumentCategory> {
    const dto = this.validation.validate(CreateDocumentCategorySchema, data);
    const category = this.categoryRepo.create({
      ...dto,
      ...(userId !== undefined ? { created_by: userId } : {}),
    });

    const saved = await this.categoryRepo.save(category);

    await this.auditLogsService.logAction(
      { id: userId || 0 },
      AuditAction.CREATE,
      'DocumentCategory',
      saved.id,
      null,
      saved,
    );

    return saved;
  }

  // update document category by id
  async updateDocumentCategoryService(
    id: number,
    data: UpdateDocumentCategoryDto,
    userId?: number,
  ): Promise<DocumentCategory> {
    const dto = this.validation.validate(UpdateDocumentCategorySchema, data);
    const target = await this.getDocumentCategoryByIdService(id);

    if (!target) {
      throw new NotFoundException(`Kategori dokumen dengan id ${id} tidak ditemukan`);
    }

    const oldData: DocumentCategory = JSON.parse(JSON.stringify(target)) as DocumentCategory;

    Object.assign(target, dto);

    if (userId !== undefined) {
      target.updated_by = userId;
    }

    const updated = await this.categoryRepo.save(target);

    await this.auditLogsService.logAction(
      { id: userId || 0 },
      AuditAction.UPDATE,
      'DocumentCategory',
      id,
      oldData,
      updated,
    );

    return updated;
  }

  // delete document category by id
  async deleteDocumentCategoryService(id: number, userId?: number): Promise<DocumentCategory> {
    const category = await this.getDocumentCategoryByIdService(id);

    if (!category) {
      throw new NotFoundException(`Kategori dokumen dengan id ${id} tidak ditemukan`);
    }

    if (userId) {
      category.deleted_by = userId;
      await this.categoryRepo.save(category);
    }

    const deleted = this.categoryRepo.softRemove(category);

    await this.auditLogsService.logAction(
      { id: userId || 0 },
      AuditAction.DELETE,
      'DocumentCategory',
      id,
      category,
      null,
    );

    return deleted;
  }

  // get all deleted document categories
  async getAllDeletedDocumentCategoriesService(): Promise<DocumentCategory[]> {
    return this.categoryRepo.find({
      withDeleted: true,
      where: { deleted_at: Not(IsNull()) },
      order: { deleted_at: 'DESC' },
    });
  }

  // restore deleted document category by id
  async restoreDeletedDocumentCategoryService(id: number): Promise<DocumentCategory> {
    const deleted = await this.categoryRepo.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!deleted || !deleted.deleted_at) {
      throw new NotFoundException(
        `Kategori dokumen dengan id ${id} tidak ditemukan atau belum dihapus`,
      );
    }

    await this.categoryRepo.restore(id);

    return deleted;
  }
}
