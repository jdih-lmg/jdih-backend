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
import { NewsCategoriesService } from './news-categories.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { Permission } from 'src/auth/decorators/permission.decorator';
import type { CreateNewsCategoryDto, UpdateNewsCategoryDto } from '../dto/news-categories.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('news-categories')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class NewsCategoriesController {
  constructor(private newsCategoryService: NewsCategoriesService) {}

  // get all news categories pagination
  @Get('list')
  @Permission('berita-kategori', 'read')
  async getAllNewsCategoriesPagination(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    const categories = await this.newsCategoryService.getAllNewsCategoriesPaginationService(
      page,
      limit,
      search,
    );
    const { data, ...meta } = categories;

    return {
      message: 'Berhasil mendapatkan daftar kategori berita',
      success: true,
      meta,
      data,
    };
  }

  // get news category by id
  @Get(':id')
  @Permission('berita-kategori', 'read')
  async getNewsCategoryById(@Param('id') id: number) {
    const data = await this.newsCategoryService.getNewsCategoryByIdService(id);

    return {
      message: 'Berhasil mendapatkan kategori berita',
      success: true,
      data,
    };
  }

  // create news category
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permission('berita-kategori', 'create')
  async createNewsCategory(@Body() dto: CreateNewsCategoryDto, @CurrentUser('id') userId: number) {
    const data = await this.newsCategoryService.createNewsCategoryService(dto, userId);

    return {
      message: 'Berhasil membuat kategori berita',
      success: true,
      data,
    };
  }

  // update news category by id
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Permission('berita-kategori', 'update')
  async updateNewsCategoryById(
    @Param('id') id: number,
    @Body() dto: UpdateNewsCategoryDto,
    @CurrentUser('id') userId: number,
  ) {
    const data = await this.newsCategoryService.updateNewsCategoryByIdService(id, dto, userId);

    return {
      message: 'Berhasil memperbarui kategori berita',
      success: true,
      data,
    };
  }

  // delete news category by id
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Permission('berita-kategori', 'manage')
  async deleteNewsCategoryById(@Param('id') id: number, @CurrentUser('id') userId: number) {
    const data = await this.newsCategoryService.deleteNewsCategoryByIdService(id, userId);

    return {
      message: 'Berhasil menghapus kategori berita',
      success: true,
      data,
    };
  }

  // get all deleted news categories
  @Get('deleted/list')
  @Permission('berita-kategori', 'manage')
  async getAllDeletedNewsCategories() {
    const data = await this.newsCategoryService.getAllDeletedNewsCategoriesService();

    return {
      message: 'Berhasil mendapatkan daftar kategori berita yang dihapus',
      success: true,
      data,
    };
  }

  // restore news category by id
  @Patch('restore/:id')
  @HttpCode(HttpStatus.OK)
  @Permission('berita-kategori', 'manage')
  async restoreNewsCategoryById(@Param('id') id: number) {
    const data = await this.newsCategoryService.restoreDeletedNewsCategoryByIdService(id);

    return {
      message: 'Berhasil mengembalikan kategori berita yang dihapus',
      success: true,
      data,
    };
  }
}
