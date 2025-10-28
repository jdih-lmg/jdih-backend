import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditAction, AuditLogsService } from 'src/audit-logs/audit-logs.service';
import { ValidationService } from 'src/common/validation.service';
import { NewsCategory } from 'src/entities/news-categories.entity';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import {
  CreateNewsCategoryDto,
  createNewsCategorySchema,
  UpdateNewsCategoryDto,
  updateNewsCategorySchema,
} from '../dto/news-categories.dto';
import { User } from 'src/entities/users.entity';

@Injectable()
export class NewsCategoriesService {
  constructor(
    @InjectRepository(NewsCategory) private newsCatRepo: Repository<NewsCategory>,
    private readonly validation: ValidationService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  // get all news categories pagination + search
  async getAllNewsCategoriesPaginationService(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{
    data: NewsCategory[];
    page: number;
    total: number;
    last_page: number;
  }> {
    const skip = (page - 1) * limit;
    const where = search ? { name: ILike(`%${search}%`) } : {};

    const [data, total] = await this.newsCatRepo.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      withDeleted: false,
    });

    return {
      data,
      page,
      total,
      last_page: Math.ceil(total / limit),
    };
  }

  // get news category by id
  async getNewsCategoryByIdService(id: number): Promise<NewsCategory> {
    const category = await this.newsCatRepo.findOne({ where: { id } });

    if (!category) throw new NotFoundException(`Kategori berita dengan id ${id} tidak ditemukan`);

    return category;
  }

  // create news category
  async createNewsCategoryService(
    dto: CreateNewsCategoryDto,
    userId?: number,
  ): Promise<NewsCategory> {
    const data = this.validation.validate(createNewsCategorySchema, dto);
    const category = this.newsCatRepo.create(data);
    const savedCategory = await this.newsCatRepo.save(category);

    await this.auditLogs.logAction(
      { id: userId } as User,
      AuditAction.CREATE,
      'NewsCategory',
      savedCategory.id,
      null,
      savedCategory,
    );

    return savedCategory;
  }

  // update news category by id
  async updateNewsCategoryByIdService(
    id: number,
    dto: UpdateNewsCategoryDto,
    userId?: number,
  ): Promise<NewsCategory> {
    const target = await this.getNewsCategoryByIdService(id);
    const data = this.validation.validate(updateNewsCategorySchema, dto);
    const oldData = JSON.parse(JSON.stringify(target)) as NewsCategory;

    Object.assign(target, data);

    const updatedCategory = await this.newsCatRepo.save(target);

    await this.auditLogs.logAction(
      { id: userId } as User,
      AuditAction.UPDATE,
      'NewsCategory',
      updatedCategory.id,
      oldData,
      updatedCategory,
    );

    return updatedCategory;
  }

  // delete news category by id
  async deleteNewsCategoryByIdService(id: number, userId?: number): Promise<NewsCategory> {
    const target = await this.getNewsCategoryByIdService(id);
    const deletedCategory = await this.newsCatRepo.softRemove(target);

    await this.auditLogs.logAction(
      { id: userId } as User,
      AuditAction.DELETE,
      'NewsCategory',
      deletedCategory.id,
      deletedCategory,
      null,
    );

    return deletedCategory;
  }

  // get all deleted news categories
  async getAllDeletedNewsCategoriesService(): Promise<NewsCategory[]> {
    return this.newsCatRepo.find({
      withDeleted: true,
      where: { deleted_at: Not(IsNull()) },
      order: { deleted_at: 'DESC' },
    });
  }

  // restore deleted news category by id
  async restoreDeletedNewsCategoryByIdService(id: number): Promise<NewsCategory> {
    const category = await this.newsCatRepo.findOne({
      withDeleted: true,
      where: { id, deleted_at: Not(IsNull()) },
    });

    if (!category) throw new NotFoundException(`Kategori berita dengan id ${id} tidak ditemukan`);

    if (!category.deleted_at)
      throw new NotFoundException(`Kategori berita dengan id ${id} tidak dalam status terhapus`);

    const restoredCategory = await this.newsCatRepo.recover(category);

    return restoredCategory;
  }
}
