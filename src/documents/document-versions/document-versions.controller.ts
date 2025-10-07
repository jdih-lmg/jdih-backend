import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { DocumentVersionsService } from './document-versions.service';
import type {
  CreateDocumentVersionDto,
  UpdateDocumentVersionDto,
} from '../dto/document-version.dto';

@Controller()
export class DocumentVersionsController {
  constructor(private readonly versionsService: DocumentVersionsService) {}

  // get all versions
  @Get('document-versions')
  async getAllDocumentVersionsController() {
    const versions = await this.versionsService.getAllDocumentVersionsService();

    return {
      message: 'Berhasil mendapatkan semua versi dokumen',
      success: true,
      data: versions,
    };
  }

  // get all versions by document id
  @Get('documents/:documentId/versions')
  async getAllDocumentVersionsByDocumentIdController(
    @Param('documentId', ParseIntPipe) documentId: number,
  ) {
    const versions =
      await this.versionsService.getAllDocumentVersionsByDocumentIdService(documentId);

    return {
      message: `Berhasil mendapatkan semua versi dokumen dengan id dokumen ${documentId}`,
      success: true,
      data: versions,
    };
  }

  // get version by id
  @Get('document-versions/:id')
  async getDocumentVersionByIdController(@Param('id', ParseIntPipe) id: number) {
    const version = await this.versionsService.getDocumentVersionByIdService(id);
    return {
      message: `Berhasil mendapatkan versi dokumen dengan id ${id}`,
      success: true,
      data: version,
    };
  }

  // create version for a document (documentId di dalam body)
  @Post('document-versions')
  @HttpCode(HttpStatus.CREATED)
  async createDocumentVersionController(@Body() dto: CreateDocumentVersionDto) {
    const version = await this.versionsService.createDocumentVersionService(dto);
    return {
      message: 'Versi dokumen berhasil dibuat',
      success: true,
      data: version,
    };
  }

  // alternative: create under a specific document path (inject documentId)
  @Post('documents/:documentId/versions')
  @HttpCode(HttpStatus.CREATED)
  async createDocumentVersionUnderDocumentController(
    @Param('documentId', ParseIntPipe) documentId: number,
    @Body() dto: Omit<CreateDocumentVersionDto, 'documentId'>,
  ) {
    const version = await this.versionsService.createDocumentVersionService({
      ...dto,
      documentId,
    } as CreateDocumentVersionDto);
    return {
      message: `Versi dokumen untuk dokumen ${documentId} berhasil dibuat`,
      success: true,
      data: version,
    };
  }

  // update version
  @Put('document-versions/:id')
  async updateDocumentVersionController(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDocumentVersionDto,
  ) {
    const version = await this.versionsService.updateDocumentVersionService(id, dto);
    return {
      message: `Versi dokumen dengan id ${id} berhasil diupdate`,
      success: true,
      data: version,
    };
  }

  // delete version
  @Delete('document-versions/:id')
  async deleteDocumentVersionByIdController(@Param('id', ParseIntPipe) id: number) {
    const version = await this.versionsService.deleteDocumentVersionByIdService(id);
    return {
      message: `Versi dokumen dengan id ${id} berhasil dihapus`,
      success: true,
      data: version,
    };
  }

  // get all deleted versions
  @Get('document-versions/deleted/list')
  async getAllDeletedDocumentVersionsController() {
    const deleted = await this.versionsService.getAllDeletedDocumentVersionsService();
    return {
      message: 'Berhasil mendapatkan semua versi dokumen yang dihapus',
      success: true,
      data: deleted,
    };
  }

  // restore version
  @Put('document-versions/restore/:id')
  async restoreDeletedDocumentVersionByIdController(@Param('id', ParseIntPipe) id: number) {
    const version = await this.versionsService.restoreDeletedDocumentVersionByIdService(id);
    return {
      message: `Versi dokumen dengan id ${id} berhasil dikembalikan`,
      success: true,
      data: version,
    };
  }
}
