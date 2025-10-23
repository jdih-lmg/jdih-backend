import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Patch,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import type { AuthUser } from 'src/auth/auth-user.interface';
import { DocumentsService } from './documents.service';
import type { CreateDocumentDto, UpdateDocumentDto } from './dto/document.dto';
import type { DocumentQueryDto } from './dto/document-query.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Permission } from 'src/auth/decorators/permission.decorator';
import { PermissionGuard } from 'src/auth/guards/permission.guard';

@Controller('documents')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  // get all documents with pagination and filters
  @Get('list')
  @Permission('dokumen', 'read')
  async getAllDocumentsPaginationController(@Query() query: DocumentQueryDto) {
    const docs = await this.documentsService.getAllDocumentsPaginationService(query);

    return docs;
  }

  // get all documents
  @Get()
  @Permission('dokumen', 'read')
  async getAllDocumentsController() {
    const docs = await this.documentsService.getAllDocumentsService();

    return {
      message: 'Berhasil mendapatkan semua dokumen',
      success: true,
      data: docs,
    };
  }

  // get document by id
  @Get(':id')
  @Permission('dokumen', 'read')
  async getDocumentByIdController(@Param('id', ParseIntPipe) id: number) {
    const doc = await this.documentsService.getDocumentByIdService(id);

    return {
      message: `Berhasil mendapatkan dokumen dengan id ${id}`,
      success: true,
      data: doc,
    };
  }

  // create document
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permission('dokumen', 'create')
  async createDocumentConroller(
    @Body() body: CreateDocumentDto,
    @CurrentUser('id') userId: number,
  ) {
    const doc = await this.documentsService.createDocumentService(body, userId);

    return {
      message: 'Berhasil membuat dokumen baru',
      success: true,
      data: doc,
    };
  }

  // update document by id
  @Put(':id')
  @Permission('dokumen', 'update')
  async updateDocumentByIdController(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateDocumentDto,
    @CurrentUser('id') userId: number,
  ) {
    const doc = await this.documentsService.updateDocumentByIdService(id, body, userId);

    return {
      message: `Berhasil memperbarui dokumen dengan id ${id}`,
      success: true,
      data: doc,
    };
  }

  // update document status by id
  @Patch(':id/status')
  @Permission('dokumen', 'verify')
  async changeDocumentStatusByIdController(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'draft' | 'verified' | 'published' | 'archived',
    @CurrentUser() user: AuthUser,
  ) {
    if (!status) throw new BadRequestException('status harus diisi');

    const result = await this.documentsService.changeDocumentStatusByIdService(id, status, user);

    return {
      message: `Berhasil mengubah status dokumen dengan id ${id} menjadi ${status}`,
      success: true,
      data: result,
    };
  }

  // delete document by id
  @Delete(':id')
  @Permission('dokumen', 'manage')
  async deleteDocumentByIdController(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    const doc = await this.documentsService.deleteDocumentByIdService(id, userId);

    return {
      message: `Berhasil menghapus dokumen dengan id ${id}`,
      success: true,
      data: doc,
    };
  }

  // get all deleted documents
  @Get('deleted/list')
  @Permission('dokumen', 'manage')
  async getlAllDeletedDocumentsController() {
    const docs = await this.documentsService.getAllDeletedDocumentsService();

    return {
      message: 'Berhasil mendapatkan semua dokumen yang terhapus',
      success: true,
      data: docs,
    };
  }

  // restore deleted document by id
  @Patch('restore/:id')
  @Permission('dokumen', 'manage')
  async restoreDeletedDocumentByIdController(@Param('id', ParseIntPipe) id: number) {
    const doc = await this.documentsService.restoreDeletedDocumentByIdService(id);

    return {
      message: `Berhasil mengembalikan dokumen dengan id ${id}`,
      success: true,
      data: doc,
    };
  }
}
