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
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { Permission } from 'src/auth/decorators/permission.decorator';
import type { UpdateNewsDto, CreateNewsDto } from './dto/news.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('news')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // get all news pagination
  @Get()
  @Permission('berita', 'read')
  async getAllNewsController(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    const data = await this.newsService.getAllNewsPaginationService(page, limit, search);

    return data;
  }

  // get news by id
  @Get(':id')
  @Permission('berita', 'read')
  async getNewsByIdController(@Param('id') id: number) {
    const data = await this.newsService.getNewsByIdService(id);

    return {
      message: 'Berhasil mengambil data berita',
      success: true,
      data,
    };
  }

  // create news
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permission('berita', 'create')
  async createNewsController(@Body() dto: CreateNewsDto, @CurrentUser('id') userId: number) {
    const data = await this.newsService.createNewsService(dto, userId);

    return {
      message: 'Berhasil membuat berita',
      success: true,
      data,
    };
  }

  // update news by id
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Permission('berita', 'update')
  async updateNewsByIdController(
    @Body() dto: UpdateNewsDto,
    @Param('id') id: number,
    @CurrentUser('id') userId: number,
  ) {
    const data = await this.newsService.updateNewsService(id, dto, userId);

    return {
      message: 'Berhasil memperbarui berita',
      success: true,
      data,
    };
  }

  // publish news by id
  @Put('publish/:id')
  @HttpCode(HttpStatus.OK)
  @Permission('berita', 'publish')
  async publishNewsByIdController(@Param('id') id: number, @CurrentUser('id') userId: number) {
    const data = await this.newsService.publishNewsService(id, userId);

    return {
      message: 'Berhasil menerbitkan berita',
      success: true,
      data,
    };
  }

  // unpublish news by id
  @Put('unpublish/:id')
  @HttpCode(HttpStatus.OK)
  @Permission('berita', 'publish')
  async unpublishNewsByIdController(@Param('id') id: number, @CurrentUser('id') userId: number) {
    const data = await this.newsService.unpublishNewsService(id, userId);

    return {
      message: 'Berhasil menyembunyikan berita',
      success: true,
      data,
    };
  }

  // delete news by id
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Permission('berita', 'manage')
  async deleteNewsByIdController(@Param('id') id: number, @CurrentUser('id') userId: number) {
    await this.newsService.deleteNewsService(id, userId);

    return {
      message: 'Berhasil menghapus berita',
      success: true,
    };
  }

  // get all deleted news
  @Get('deleted/list')
  @Permission('berita', 'manage')
  async getAllDeletedNewsController() {
    const data = await this.newsService.getAllDeletedNewsService();

    return {
      message: 'Berhasil mengambil daftar berita terhapus',
      success: true,
      data,
    };
  }

  // restore deleted news by id
  @Put('restore/:id')
  @Permission('berita', 'manage')
  async restoreDeletedNewsByIdController(@Param('id') id: number) {
    const data = await this.newsService.restoreDeletedNewsService(id);

    return {
      message: 'Berhasil mengembalikan berita yang terhapus',
      success: true,
      data,
    };
  }
}
