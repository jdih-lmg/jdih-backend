import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DocumentVersionsService } from './document-versions.service';
import type {
  CreateDocumentVersionDto,
  UpdateDocumentVersionDto,
} from '../dto/document-version.dto';
import { DocumentVersion } from 'src/entities/document-versions.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Permission } from 'src/auth/decorators/permission.decorator';

@Controller('document-versions')
@UseGuards(JwtAuthGuard)
export class DocumentVersionsController {
  constructor(private readonly versionsService: DocumentVersionsService) {}

  // mapping response version object
  private toDocumentVersionResponse(version: DocumentVersion) {
    return {
      id: version.id,
      version_number: version.version_number,
      file_url: version.file_url,
      notes: version.notes,
      document: version.document
        ? {
            id: version.document.id,
            title: version.document.title,
            abstract: version.document.abstract,
          }
        : null,
      created_by: version.created_by,
      updated_by: version.updated_by,
      created_at: version.created_at,
      updated_at: version.updated_at,
      deleted_at: version.deleted_at,
    };
  }

  // mapping response version array
  private toDocumentVersionsResponse(versions: DocumentVersion[]) {
    return versions.map((version) => this.toDocumentVersionResponse(version));
  }

  // get all versions with pagination or search
  @Get('list')
  @Permission('dokumen-versi', 'read')
  async getAllDocumentVersionsPaginationController(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    const versions = await this.versionsService.getAllDocumentVersionsPaginationService(
      page,
      limit,
      search,
    );

    const { data, ...meta } = versions;

    return {
      message: 'Berhasil mendapatkan semua versi dokumen',
      success: true,
      data: this.toDocumentVersionsResponse(data),
      meta,
    };
  }

  // get all versions
  @Get()
  @Permission('dokumen-versi', 'read')
  async getAllDocumentVersionsController() {
    const versions = await this.versionsService.getAllDocumentVersionsService();

    return {
      message: 'Berhasil mendapatkan semua versi dokumen',
      success: true,
      data: this.toDocumentVersionsResponse(versions),
    };
  }

  // get all versions by document id
  @Get('documents/:documentId/versions')
  @Permission('dokumen-versi', 'read')
  async getAllDocumentVersionsByDocumentIdController(
    @Param('documentId', ParseIntPipe) documentId: number,
  ) {
    const versions =
      await this.versionsService.getAllDocumentVersionsByDocumentIdService(documentId);

    return {
      message: `Berhasil mendapatkan semua versi dokumen dengan id dokumen ${documentId}`,
      success: true,
      data: this.toDocumentVersionsResponse(versions),
    };
  }

  // get version by id
  @Get(':id')
  @Permission('dokumen-versi', 'read')
  async getDocumentVersionByIdController(@Param('id', ParseIntPipe) id: number) {
    const version = await this.versionsService.getDocumentVersionByIdService(id);

    return {
      message: `Berhasil mendapatkan versi dokumen dengan id ${id}`,
      success: true,
      data: this.toDocumentVersionResponse(version),
    };
  }

  // create version untuk document (documentId di dalam body)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permission('dokumen-versi', 'create')
  async createDocumentVersionController(
    @Body() dto: CreateDocumentVersionDto,
    @CurrentUser('userId') userId: number,
  ) {
    const version = await this.versionsService.createDocumentVersionService(dto, userId);

    return {
      message: 'Versi dokumen berhasil dibuat',
      success: true,
      data: version,
    };
  }

  // alternatif: create spesifik di bawah document (inject documentId)
  @Post('documents/:documentId/versions')
  @Permission('dokumen-versi', 'create')
  async createDocumentVersionUnderDocumentController(
    @Param('documentId', ParseIntPipe) documentId: number,
    @Body() dto: Omit<CreateDocumentVersionDto, 'document_id'>,
    @CurrentUser('userId') userId: number,
  ) {
    const version = await this.versionsService.createDocumentVersionService({
      ...dto,
      document_id: documentId,
      userId,
    } as CreateDocumentVersionDto);

    return {
      message: `Versi dokumen untuk dokumen ${documentId} berhasil dibuat`,
      success: true,
      data: this.toDocumentVersionResponse(version),
    };
  }

  // update version by id
  @Put(':id')
  @Permission('dokumen-versi', 'update')
  async updateDocumentVersionController(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDocumentVersionDto,
    @CurrentUser('userId') userId: number,
  ) {
    const version = await this.versionsService.updateDocumentVersionService(id, dto, userId);

    return {
      message: `Versi dokumen dengan id ${id} berhasil diupdate`,
      success: true,
      data: version,
    };
  }

  // delete version
  @Delete(':id')
  @Permission('dokumen-versi', 'delete')
  async deleteDocumentVersionByIdController(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('userId') userId: number,
  ) {
    const version = await this.versionsService.deleteDocumentVersionByIdService(id, userId);

    return {
      message: `Versi dokumen dengan id ${id} berhasil dihapus`,
      success: true,
      data: version,
    };
  }

  // get all deleted versions
  @Get('deleted/list')
  @Permission('dokumen-versi', 'read')
  async getAllDeletedDocumentVersionsController() {
    const deleted = await this.versionsService.getAllDeletedDocumentVersionsService();

    return {
      message: 'Berhasil mendapatkan semua versi dokumen yang dihapus',
      success: true,
      data: deleted,
    };
  }

  // restore version
  @Patch('restore/:id')
  @Permission('dokumen-versi', 'update')
  async restoreDeletedDocumentVersionByIdController(@Param('id', ParseIntPipe) id: number) {
    const version = await this.versionsService.restoreDeletedDocumentVersionByIdService(id);

    return {
      message: `Versi dokumen dengan id ${id} berhasil dikembalikan`,
      success: true,
      data: version,
    };
  }
}
