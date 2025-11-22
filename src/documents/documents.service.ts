import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, IsNull, Not, Repository } from 'typeorm';
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
import { DocumentQueryDto, documentQuerySchema } from './dto/document-query.dto';
import { AuditAction, AuditLogsService } from 'src/audit-logs/audit-logs.service';
import { AuthUser } from 'src/auth/auth-user.interface';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document) private documentRepo: Repository<Document>,
    @InjectRepository(DocumentCategory) private categoryRepo: Repository<DocumentCategory>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly auditLogsService: AuditLogsService,
    private readonly validation: ValidationService,
  ) {}

  // mapper documents helper
  mapDocumentResponse = (doc: Document) => ({
    id: doc.id,
    title: doc.title,
    number: doc.number,
    type: doc.type,
    year: doc.year,
    subject: doc.subject,
    abstract: doc.abstract,
    keywords: doc.keywords,
    status: doc.status,
    category: doc.category
      ? {
          id: doc.category.id,
          name: doc.category.name,
        }
      : null,
    publisher: doc.publisher,
    signed_by: doc.signed_by,
    date_signed: doc.date_signed,
    effective_date: doc.effective_date,
    verification_date: doc.verification_date,
    file_url: doc.file_url,
    verified_by: doc.verified_by
      ? {
          id: doc.verified_by.id,
          name: doc.verified_by.name,
        }
      : null,
    created_by: doc.created_by,
    updated_by: doc.updated_by,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
  });

  // get all documents with pagination and filters
  async getAllDocumentsPaginationService(query: DocumentQueryDto) {
    const { page, limit, title, number, status, year, category_id, search } =
      this.validation.validate(documentQuerySchema, query);

    const baseWhere: FindOptionsWhere<Document> = {
      deleted_at: IsNull(),
    };

    if (title) {
      baseWhere.title = ILike(`%${title}%`);
    }

    if (number) {
      baseWhere.number = ILike(`%${number}%`);
    }

    if (status) {
      baseWhere.status = status;
    }

    if (year) {
      baseWhere.year = year;
    }

    if (category_id) {
      baseWhere.category = { id: category_id } as FindOptionsWhere<DocumentCategory>;
    }

    // FULLTEXT SEARCH (OR di banyak field)
    let where: FindOptionsWhere<Document>[] | FindOptionsWhere<Document> = baseWhere;

    if (search && search.trim() !== '') {
      const s = ILike(`%${search}%`);

      where = [
        { ...baseWhere, title: s },
        { ...baseWhere, number: s },
        { ...baseWhere, category: { name: s } as FindOptionsWhere<DocumentCategory> },
      ];
    }

    const [data, total] = await this.documentRepo.findAndCount({
      where,
      relations: ['category', 'verified_by', 'versions'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const mappedData = data.map(this.mapDocumentResponse);

    return {
      success: true,
      message: 'Berhasil mendapatkan daftar dokumen',
      meta: {
        page,
        total,
        last_page: Math.ceil(total / limit),
      },
      data: mappedData,
    };
  }

  // get all documents
  async getAllDocumentsService() {
    const docs = await this.documentRepo.find({
      relations: ['category', 'verified_by', 'versions'],
      order: { created_at: 'DESC' },
    });

    return docs.map(this.mapDocumentResponse);
  }

  // get document by id
  async getDocumentByIdService(id: number): Promise<Document> {
    const doc = await this.documentRepo.findOne({
      where: { id },
      relations: ['category', 'verified_by', 'versions'],
    });

    if (!doc) throw new NotFoundException(`Document dengan id ${id} tidak ditemukan`);

    const mapped = this.mapDocumentResponse(doc);

    return mapped as unknown as Document;
  }

  // get document by id published
  async getPublishedDocumentByIdService(id: number): Promise<Document> {
    const doc = await this.documentRepo.findOne({
      where: { id, status: 'published' },
      relations: ['category', 'verified_by', 'versions'],
    });

    if (!doc) throw new NotFoundException(`Document dengan id ${id} tidak ditemukan`);

    const mapped = this.mapDocumentResponse(doc);

    return mapped as unknown as Document;
  }

  // get documents statistik tahunan
  async getYearlyStatsService(): Promise<{ year: number; count: number }[]> {
    return this.documentRepo.query(`
      SELECT 
        year,
        COUNT(*) AS count
      FROM documents
      WHERE deleted_at IS NULL
      GROUP BY year
      ORDER BY year ASC
    `);
  }

  // get statistik bulanan per tahun
  async getMonthlyStatsByYearService(year: number): Promise<{ month: number; count: number }[]> {
    return this.documentRepo.query(
      `
      SELECT
        MONTH(created_at) AS month,
        COUNT(*) AS count
      FROM documents
      WHERE deleted_at IS NULL
        AND year = ?
      GROUP BY month
      ORDER BY month ASC
    `,
      [year],
    );
  }

  // get statistik jenis dokumen (type)
  async getTypeStatsService(): Promise<{ type: string; count: number }[]> {
    return this.documentRepo.query(`
      SELECT
        type,
        COUNT(*) AS count
      FROM documents
      WHERE deleted_at IS NULL
      GROUP BY type
      ORDER BY count DESC
    `);
  }

  // get statistik status dokumen
  async getStatusStatsService(): Promise<{ status: string; count: number }[]> {
    return this.documentRepo.query(`
      SELECT
        status,
        COUNT(*) AS count
      FROM documents
      WHERE deleted_at IS NULL
      GROUP BY status
    `);
  }

  // create document
  async createDocumentService(data: CreateDocumentDto, userId?: number): Promise<Document> {
    // validasi input sesuai schema
    const dto = this.validation.validate(createDocumentSchema, data);

    // pastikan user valid dan ambil role-nya
    const user = userId
      ? await this.userRepo.findOne({ where: { id: userId }, relations: ['role'] })
      : null;

    if (!user) {
      throw new ForbiddenException('User tidak ditemukan atau tidak memiliki akses.');
    }

    // tentukan role user
    const roleName = user.role?.name || '';

    // role petugas_dokumen hanya boleh membuat draft
    if (roleName === 'petugas_dokumen') {
      dto.status = 'draft';
    }

    // jika bukan admin/verifikator, cegah set status selain draft
    if (!['admin', 'verifikator'].includes(roleName) && dto.status !== 'draft') {
      throw new ForbiddenException(
        `Role ${roleName} tidak diizinkan membuat dokumen dengan status ${dto.status}`,
      );
    }

    // siapkan relasi kategori & verifikator
    let category: DocumentCategory | null = null;
    let verifiedBy: User | null = null;

    if (dto.category_id) {
      category = await this.categoryRepo.findOne({ where: { id: dto.category_id } });
    }

    if (dto.verified_by) {
      verifiedBy = await this.userRepo.findOne({ where: { id: dto.verified_by } });
    }

    // buat entity dokumen baru
    const doc = this.documentRepo.create({
      ...dto,
      category,
      verified_by: verifiedBy,
      created_by: user.id,
    });

    // simpan ke database
    const saved = await this.documentRepo.save(doc);

    // catat audit log
    await this.auditLogsService.logAction(
      { id: user.id },
      AuditAction.CREATE,
      'Document',
      saved.id,
      null,
      saved,
    );

    // kembalikan hasil dengan mapping response
    return this.mapDocumentResponse(saved) as unknown as Document;
  }

  // update document by id
  async updateDocumentByIdService(
    id: number,
    data: UpdateDocumentDto,
    userId?: number,
  ): Promise<Document> {
    const target = await this.getDocumentByIdService(id);

    // pastikan user valid dan ambil role-nya
    const user = userId
      ? await this.userRepo.findOne({ where: { id: userId }, relations: ['role'] })
      : null;

    if (!user) {
      throw new ForbiddenException('User tidak ditemukan atau tidak memiliki akses.');
    }

    // tentukan role user
    const roleName = user.role?.name || '';

    // role petugas_dokumen hanya boleh membuat draft
    if (roleName === 'petugas_dokumen') {
      data.status = 'draft';
    }

    // jika bukan admin/verifikator, cegah set status selain draft
    if (!['admin', 'verifikator'].includes(roleName) && data.status !== 'draft') {
      throw new ForbiddenException(
        `Role ${roleName} tidak diizinkan membuat dokumen dengan status ${data.status}`,
      );
    }

    if (data.category_id) {
      target.category = await this.categoryRepo.findOne({ where: { id: data.category_id } });
    }

    if (data.verified_by) {
      target.verified_by = await this.userRepo.findOne({ where: { id: data.verified_by } });
    }

    const dto = this.validation.validate(updateDocumentSchema, data);

    const oldData = JSON.parse(JSON.stringify(target)) as Document;

    Object.assign(target, dto);

    if (userId !== undefined) {
      target.updated_by = userId;
    }

    const updated = await this.documentRepo.save(target);

    await this.auditLogsService.logAction(
      { id: userId || 0 },
      AuditAction.UPDATE,
      'Document',
      updated.id,
      oldData,
      updated,
    );

    return updated;
  }

  // update document status
  async changeDocumentStatusByIdService(
    id: number,
    newStatus: 'draft' | 'verified' | 'published' | 'archived',
    user: AuthUser,
  ) {
    const doc = await this.getDocumentByIdService(id);

    const current = doc.status;

    // rule transisi status
    const statusTransitions: Record<string, Record<string, string[]>> = {
      draft: {
        verified: ['admin', 'verifikator'], // hanya admin & verifikator
      },
      verified: {
        published: ['admin'], // hanya admin
        archived: ['admin'], // hanya admin
      },
      published: {
        archived: ['admin'], // hanya admin
      },
      archived: {
        draft: ['admin'], // hanya admin
      },
    };

    // cek validitas transisi
    const allowedRoles = statusTransitions[current]?.[newStatus];

    if (user.role.name === 'petugas_dokumen' && newStatus !== 'draft') {
      throw new ForbiddenException('Petugas dokumen tidak boleh mengubah status dokumen');
    }

    if (!allowedRoles) {
      throw new BadRequestException(
        `Transisi status dari ${current} ke ${newStatus} tidak diizinkan`,
      );
    }

    if (!allowedRoles.includes(user.role.name)) {
      throw new ForbiddenException(
        `Role ${user.role.name} tidak memiliki izin untuk mengubah status dari ${current} ke ${newStatus}`,
      );
    }

    // update dokumen
    doc.status = newStatus;

    if (newStatus === 'verified') {
      doc.verification_date = new Date();
      doc.updated_at = new Date();
      doc.updated_by = user.id || null;
      doc.verified_by = user.id ? await this.userRepo.findOne({ where: { id: user.id } }) : null;
    }

    if (newStatus === 'published') {
      doc.effective_date = new Date();
      doc.updated_at = new Date();
      doc.updated_by = user.id || null;
    }

    await this.documentRepo.save(doc);

    // audit log
    await this.auditLogsService.logAction(
      { id: user.id || 0 },
      AuditAction.UPDATE,
      'Document Status',
      doc.id,
      { status: current },
      { status: newStatus },
    );

    return this.mapDocumentResponse(doc);
  }

  // delete document by id
  async deleteDocumentByIdService(id: number, userId?: number): Promise<Document> {
    const document = await this.getDocumentByIdService(id);

    document.deleted_by = userId || null;

    await this.documentRepo.save(document);
    const deleted = this.documentRepo.softDelete(id);

    await this.auditLogsService.logAction(
      { id: userId || 0 },
      AuditAction.DELETE,
      'Document',
      id,
      document,
      null,
    );

    return deleted.then(() => document);
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
