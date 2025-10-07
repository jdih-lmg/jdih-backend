import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { DocumentCategoryService } from './document-category.service';
import type {
  CreateDocumentCategoryDto,
  UpdateDocumentCategoryDto,
} from '../dto/document-category.dto';

@Controller('document-category')
export class DocumentCategoryController {
  constructor(private readonly categoriesService: DocumentCategoryService) {}

  // get all document categories
  @Get()
  async getAllDocumentCategoriesController() {
    const categories = await this.categoriesService.getAllDocumentCategoriesService();

    return {
      message: 'Berhasil mendapatkan semua kategori dokumen',
      success: true,
      data: categories,
    };
  }

  // get document category by id
  @Get(':id')
  async getDocumentCategoryByIdController(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoriesService.getDocumentCategoryByIdService(id);

    return {
      message: `Berhasil mendapatkan kategori dokumen dengan id ${id}`,
      success: true,
      data: category,
    };
  }

  // create document category
  @Post()
  async createDocumentCategoryController(@Body() dto: CreateDocumentCategoryDto) {
    const category = await this.categoriesService.createDocumentCategoryService(dto);

    return {
      message: 'Berhasil membuat kategori dokumen',
      success: true,
      data: category,
    };
  }

  // update document category by id
  @Put(':id')
  async updateDocumentCategoryByIdController(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDocumentCategoryDto,
  ) {
    const category = await this.categoriesService.updateDocumentCategoryService(id, dto);

    return {
      message: `Berhasil memperbarui kategori dokumen dengan id ${id}`,
      success: true,
      data: category,
    };
  }

  // delete document category by id
  @Delete(':id')
  async deleteDocumentCategoryByIdController(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoriesService.deleteDocumentCategoryService(id);

    return {
      message: `Berhasil menghapus kategori dokumen dengan id ${id}`,
      success: true,
      data: category,
    };
  }

  // get all deleted document categories
  @Get('deleted/list')
  async getAllDeletedDocumentCategoriesController() {
    const deleted = await this.categoriesService.getAllDeletedDocumentCategoriesService();

    return {
      message: 'Berhasil mendapatkan semua kategori dokumen yang dihapus',
      success: true,
      data: deleted,
    };
  }

  // restore deleted document category by id
  @Patch('restore/:id')
  async restoreDeletedDocumentCategoryByIdController(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoriesService.restoreDeletedDocumentCategoryService(id);

    return {
      message: `Berhasil mengembalikan kategori dokumen dengan id ${id}`,
      success: true,
      data: category,
    };
  }
}
