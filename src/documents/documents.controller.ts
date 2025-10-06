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

    return {
      message: 'Berhasil mendapatkan semua dokumen',
      success: true,
      data: documents,
    };
  }

  // get document by id
  @Get(':id')
  async getDocumentByIdController(@Param('id') id: number) {
    const document = await this.documentService.getDocumentByIdService(id);

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
  async updateDocumentController(@Param('id') id: number, @Body() dto: UpdateDocumentDto) {
    const document = await this.documentService.updateDocumentService(id, dto);

    return {
      message: `Dokumen dengan id ${id} berhasil diupdate`,
      success: true,
      data: document,
    };
  }

  // soft delete document by id
  @Delete(':id')
  async deleteDocumentByIdController(@Param('id') id: number) {
    const document = await this.documentService.deleteDocumentByIdService(id);

    return {
      message: `Dokumen dengan id ${id} berhasil dihapus`,
      success: true,
      data: document,
    };
  }
}
