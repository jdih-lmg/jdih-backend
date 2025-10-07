import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import type { CreateDocumentDto, UpdateDocumentDto } from './dto/document.dto';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentService: DocumentsService) {}

  // get all documents
  @Get()
  async getAllDocumentsController() {
    const documents = await this.documentService.getAllDocumentsService();

    // custom verifiedBy to only return id, name, and email
    documents.map((doc) => {
      if (doc.verifiedBy) {
        doc.verifiedBy = {
          id: doc.verifiedBy.id,
          name: doc.verifiedBy.name,
          email: doc.verifiedBy.email,
        } as unknown as typeof doc.verifiedBy;
      }
      return doc;
    });

    return {
      message: 'Berhasil mendapatkan semua dokumen',
      success: true,
      data: documents,
    };
  }

  // get document by id
  @Get(':id')
  async getDocumentByIdController(@Param('id', ParseIntPipe) id: number) {
    const document = await this.documentService.getDocumentByIdService(id);

    // custom verifiedBy to only return id, name, and email
    if (document && document.verifiedBy) {
      document.verifiedBy = {
        id: document.verifiedBy.id,
        name: document.verifiedBy.name,
        email: document.verifiedBy.email,
      } as unknown as typeof document.verifiedBy;
    }

    return {
      message: `Berhasil mendapatkan dokumen dengan id ${id}`,
      success: true,
      data: document,
    };
  }

  // create document
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createDocumentController(@Body() dto: CreateDocumentDto) {
    const document = await this.documentService.createDocumentService(dto);

    return {
      message: 'Dokumen berhasil dibuat',
      success: true,
      data: document,
    };
  }

  // update document by id
  @Put(':id')
  async updateDocumentController(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDocumentDto,
  ) {
    const document = await this.documentService.updateDocumentService(id, dto);

    return {
      message: `Dokumen dengan id ${id} berhasil diupdate`,
      success: true,
      data: document,
    };
  }

  // soft delete document by id
  @Delete(':id')
  async deleteDocumentByIdController(@Param('id', ParseIntPipe) id: number) {
    const document = await this.documentService.deleteDocumentByIdService(id);

    return {
      message: `Dokumen dengan id ${id} berhasil dihapus`,
      success: true,
      data: document,
    };
  }

  // get all deleted documents
  @Get('deleted/list')
  async getAllDeletedDocumentsController() {
    const docDeleted = await this.documentService.getAllDeletedDocumentsService();

    return {
      message: 'Berhasil mendapatkan semua dokumen yang dihapus',
      success: true,
      data: docDeleted,
    };
  }

  // restore deleted document by id
  @Patch('restore/:id')
  async restoreDeletedDocumentByIdController(@Param('id', ParseIntPipe) id: number) {
    const document = await this.documentService.restoreDeletedDocumentByIdService(id);

    return {
      message: `Dokumen dengan id ${id} berhasil dikembalikan`,
      success: true,
      data: document,
    };
  }
}
