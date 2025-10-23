import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationService } from 'src/common/validation.service';
import { NewsCategory } from 'src/entities/news-categories.entity';
import { News } from 'src/entities/news.entity';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { CreateNewsDto, createNewsSchema, UpdateNewsDto, updateNewsSchema } from './dto/news.dto';
import { User } from 'src/entities/users.entity';
import { AuditAction, AuditLogsService } from 'src/audit-logs/audit-logs.service';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private newsRepo: Repository<News>,
    @InjectRepository(NewsCategory) private newsCategoryRepo: Repository<NewsCategory>,
    private readonly validationService: ValidationService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  // mapping data response news
  formatNewsResponse(news: News) {
    return {
      id: news.id,
      title: news.title,
      slug: news.slug,
      content: news.content,
      thumbnail_url: news.thumbnailUrl,
      is_published: news.isPublished,
      published_at: news.publishedAt,
      created_at: news.createdAt,
      updated_at: news.updatedAt,
      author: news.author
        ? {
            id: news.author.id,
            name: news.author.name,
            email: news.author.email,
          }
        : null,
      categories: news.categories
        ? news.categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            description: cat.description,
          }))
        : [],
    };
  }

  // get all news pagination and search
  async getAllNewsPaginationService(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const where = search
      ? [{ title: ILike(`%${search}%`) }, { content: ILike(`%${search}%`) }]
      : {};

    const [data, total] = await this.newsRepo.findAndCount({
      where,
      relations: ['author', 'categories'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      message: 'Berhasil mengambil daftar berita',
      success: true,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
      data: data.map((news) => this.formatNewsResponse(news)),
    };
  }

  // get news by id
  async getNewsByIdService(id: number): Promise<News> {
    const news = await this.newsRepo.findOne({
      where: { id },
      relations: ['author', 'categories'],
    });

    if (!news) throw new NotFoundException(`Berita dengan ID ${id} tidak ditemukan`);

    return this.formatNewsResponse(news) as unknown as News;
  }

  // create news
  async createNewsService(dto: CreateNewsDto, userId?: number): Promise<News> {
    const data = this.validationService.validate(createNewsSchema, dto);

    const resCategories =
      data.category_ids && data.category_ids?.length
        ? await this.newsCategoryRepo.findBy({ id: In(data.category_ids) })
        : [];

    const news = this.newsRepo.create({
      ...data,
      categories: resCategories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
      })),
      author: userId ? ({ id: userId } as User) : undefined,
    });

    const saved = await this.newsRepo.save(news);

    await this.auditLogs.logAction(
      { id: userId } as User,
      AuditAction.CREATE,
      'news',
      saved.id,
      null,
      saved,
    );

    return this.formatNewsResponse(saved) as unknown as News;
  }

  // update news
  async updateNewsService(id: number, dto: UpdateNewsDto, userId?: number): Promise<News> {
    const data = this.validationService.validate(updateNewsSchema, dto);
    const target = await this.getNewsByIdService(id);

    if (target.deletedAt) throw new ForbiddenException('Berita telah dihapus');

    const oldData = JSON.parse(JSON.stringify(target)) as News;

    if (data.category_ids) {
      target.categories = await this.newsCategoryRepo.findBy({ id: In(data.category_ids) });
    }

    Object.assign(target, data);

    const saved = await this.newsRepo.save(target);

    await this.auditLogs.logAction(
      { id: userId } as User,
      AuditAction.UPDATE,
      'news',
      saved.id,
      oldData,
      saved,
    );

    return this.formatNewsResponse(saved) as unknown as News;
  }

  // delete news
  async deleteNewsService(id: number, userId?: number): Promise<News> {
    const target = await this.getNewsByIdService(id);

    if (target.deletedAt) throw new ForbiddenException('Berita telah dihapus');

    const oldData = JSON.parse(JSON.stringify(target)) as News;

    const deleted = await this.newsRepo.softRemove(target);

    await this.auditLogs.logAction(
      { id: userId } as User,
      AuditAction.DELETE,
      'news',
      deleted.id,
      oldData,
      null,
    );

    return deleted;
  }

  // get all deleted news
  async getAllDeletedNewsService(): Promise<News[]> {
    return this.newsRepo.find({
      where: { deletedAt: Not(IsNull()) },
      relations: ['author', 'categories'],
      order: { deletedAt: 'DESC' },
    });
  }

  // restore deleted news
  async restoreDeletedNewsService(id: number): Promise<News> {
    const target = await this.newsRepo.findOne({
      where: { id, deletedAt: Not(IsNull()) },
      relations: ['author', 'categories'],
    });

    if (!target)
      throw new NotFoundException(`Berita dengan ID ${id} tidak ditemukan atau belum dihapus`);

    return this.newsRepo.recover(target);
  }

  // publish news service
  async publishNewsService(id: number, userId?: number): Promise<News> {
    const target = await this.getNewsByIdService(id);

    if (target.deletedAt) throw new ForbiddenException('Berita telah dihapus');

    target.isPublished = true;
    target.publishedAt = new Date();

    const published = this.newsRepo.save(target);

    await this.auditLogs.logAction(
      { id: userId } as User,
      AuditAction.UPDATE,
      'news',
      target.id,
      null,
      published,
    );

    return this.formatNewsResponse(await published) as unknown as News;
  }

  // unpublish news service
  async unpublishNewsService(id: number, userId?: number): Promise<News> {
    const target = await this.getNewsByIdService(id);

    if (target.deletedAt) throw new ForbiddenException('Berita telah dihapus');

    target.isPublished = false;
    target.publishedAt = undefined;

    const unpublished = this.newsRepo.save(target);

    await this.auditLogs.logAction(
      { id: userId } as User,
      AuditAction.UPDATE,
      'news',
      target.id,
      null,
      unpublished,
    );

    return this.formatNewsResponse(await unpublished) as unknown as News;
  }
}
