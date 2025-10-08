import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationService } from 'src/common/validation.service';
import { DocumentCategory } from 'src/entities/document-categories.entity';
import { IsNull, Not, Repository } from 'typeorm';
import {
  CreateDocumentCategoryDto,
  CreateDocumentCategorySchema,
  UpdateDocumentCategoryDto,
  UpdateDocumentCategorySchema,
} from '../dto/document-category.dto';

@Injectable()
export class DocumentCategoryService {
  constructor(
    @InjectRepository(DocumentCategory) private readonly categoryRepo: Repository<DocumentCategory>,
    private readonly validation: ValidationService,
  ) {}

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
  async createDocumentCategoryService(data: CreateDocumentCategoryDto): Promise<DocumentCategory> {
    const dto = this.validation.validate(CreateDocumentCategorySchema, data);
    const category = this.categoryRepo.create(dto);

    return this.categoryRepo.save(category);
  }

  // update document category by id
  async updateDocumentCategoryService(
    id: number,
    data: UpdateDocumentCategoryDto,
  ): Promise<DocumentCategory> {
    const dto = this.validation.validate(UpdateDocumentCategorySchema, data);
    const category = await this.getDocumentCategoryByIdService(id);

    if (!category) throw new Error(`Kategori dokumen dengan id ${id} tidak ditemukan`);
    Object.assign(category, dto);

    return this.categoryRepo.save(category);
  }

  // delete document category by id
  async deleteDocumentCategoryService(id: number): Promise<DocumentCategory> {
    const category = await this.getDocumentCategoryByIdService(id);

    if (!category) throw new Error(`Kategori dokumen dengan id ${id} tidak ditemukan`);

    await this.categoryRepo.softRemove(category);

    return category;
  }

  // get all deleted document categories
  async getAllDeletedDocumentCategoriesService(): Promise<DocumentCategory[]> {
    return this.categoryRepo.find({
      withDeleted: true,
      where: { deletedAt: Not(IsNull()) },
      order: { deletedAt: 'DESC' },
    });
  }

  // restore deleted document category by id
  async restoreDeletedDocumentCategoryService(id: number): Promise<DocumentCategory> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!category) throw new Error(`Kategori dokumen dengan id ${id} tidak ditemukan`);
    if (!category.deletedAt)
      throw new Error(`Kategori dokumen dengan id ${id} tidak dalam keadaan terhapus`);

    await this.categoryRepo.restore(id);

    return category;
  }
}
