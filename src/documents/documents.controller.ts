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
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/entities/roles.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  // get all documents with pagination and filters
  @Get('list')
  async getAllDocumentsPaginationController(@Query() query: DocumentQueryDto) {
    const docs = await this.documentsService.getAllDocumentsPaginationService(query);

    return docs;
  }

  // get all documents
  @Get()
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
  @Roles(RoleEnum.ADMIN)
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
  @Roles(RoleEnum.ADMIN)
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
  @Roles(RoleEnum.ADMIN)
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
  @Roles(RoleEnum.ADMIN)
  async restoreDeletedDocumentByIdController(@Param('id', ParseIntPipe) id: number) {
    const doc = await this.documentsService.restoreDeletedDocumentByIdService(id);

    return {
      message: `Berhasil mengembalikan dokumen dengan id ${id}`,
      success: true,
      data: doc,
    };
  }
}
