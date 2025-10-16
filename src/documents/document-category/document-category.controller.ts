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
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/entities/roles.entity';

@Controller('document-category')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentCategoryController {
  constructor(private readonly categoriesService: DocumentCategoryService) {}

  // get all document categories with pagination or search
  @Get('list')
  async getAllDocumentCategoriesWithPaginationController(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.categoriesService.getAllDocumentCategoriesPaginationService(page, limit, search);
  }

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
  @Roles(RoleEnum.ADMIN)
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
