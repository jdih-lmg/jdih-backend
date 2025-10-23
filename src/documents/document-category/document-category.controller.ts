import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DocumentCategoryService } from './document-category.service';
import type {
  CreateDocumentCategoryDto,
  UpdateDocumentCategoryDto,
} from '../dto/document-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Permission } from 'src/auth/decorators/permission.decorator';
import { PermissionGuard } from 'src/auth/guards/permission.guard';

@Controller('document-category')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class DocumentCategoryController {
  constructor(private readonly categoriesService: DocumentCategoryService) {}

  // get all document categories with pagination or search
  @Get('list')
  @Permission('dokumen-kategori', 'read')
  async getAllDocumentCategoriesWithPaginationController(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    const categories = await this.categoriesService.getAllDocumentCategoriesPaginationService(
      page,
      limit,
      search,
    );

    const { data, ...meta } = categories;

    return {
      message: 'Berhasil mendapatkan daftar kategori dokumen',
      success: true,
      meta,
      data,
    };
  }

  // get all document categories
  @Get()
  @Permission('dokumen-kategori', 'read')
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
  @Permission('dokumen-kategori', 'read')
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
  @Permission('dokumen-kategori', 'create')
  async createDocumentCategoryController(
    @Body() dto: CreateDocumentCategoryDto,
    @CurrentUser('userId') userId: number,
  ) {
    const category = await this.categoriesService.createDocumentCategoryService(dto, userId);

    return {
      message: 'Berhasil membuat kategori dokumen',
      success: true,
      data: category,
    };
  }

  // update document category by id
  @Put(':id')
  @Permission('dokumen-kategori', 'update')
  async updateDocumentCategoryByIdController(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDocumentCategoryDto,
    @CurrentUser('userId') userId: number,
  ) {
    const category = await this.categoriesService.updateDocumentCategoryService(id, dto, userId);

    return {
      message: `Berhasil memperbarui kategori dokumen dengan id ${id}`,
      success: true,
      data: category,
    };
  }

  // delete document category by id
  @Delete(':id')
  @Permission('dokumen-kategori', 'manage')
  async deleteDocumentCategoryByIdController(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('userId') userId: number,
  ) {
    const category = await this.categoriesService.deleteDocumentCategoryService(id, userId);

    return {
      message: `Berhasil menghapus kategori dokumen dengan id ${id}`,
      success: true,
      data: category,
    };
  }

  // get all deleted document categories
  @Get('deleted/list')
  @Permission('dokumen-kategori', 'manage')
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
  @Permission('dokumen-kategori', 'manage')
  async restoreDeletedDocumentCategoryByIdController(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoriesService.restoreDeletedDocumentCategoryService(id);

    return {
      message: `Berhasil mengembalikan kategori dokumen dengan id ${id}`,
      success: true,
      data: category,
    };
  }
}
