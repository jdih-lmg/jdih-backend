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
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import type { CreateDocumentDto, UpdateDocumentDto } from './dto/document.dto';
import type { DocumentQueryDto } from './dto/document-query.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Permission } from 'src/auth/decorators/permission.decorator';

@Controller('documents')
@UseGuards(JwtAuthGuard)
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
    @CurrentUser('userId') userId: number,
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
    @CurrentUser('userId') userId: number,
  ) {
    const doc = await this.documentsService.updateDocumentByIdService(id, body, userId);

    return {
      message: `Berhasil memperbarui dokumen dengan id ${id}`,
      success: true,
      data: doc,
    };
  }

  // delete document by id
  @Delete(':id')
  @Permission('dokumen', 'delete')
  async deleteDocumentByIdController(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('userId') userId: number,
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
  @Permission('dokumen', 'read')
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
  @Permission('dokumen', 'update')
  async restoreDeletedDocumentByIdController(@Param('id', ParseIntPipe) id: number) {
    const doc = await this.documentsService.restoreDeletedDocumentByIdService(id);

    return {
      message: `Berhasil mengembalikan dokumen dengan id ${id}`,
      success: true,
      data: doc,
    };
  }
}
