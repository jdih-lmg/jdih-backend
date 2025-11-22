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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import type { AuthUser } from 'src/auth/auth-user.interface';
import { DocumentsService } from './documents.service';
import type { CreateDocumentDto, UpdateDocumentDto } from './dto/document.dto';
import type { DocumentQueryDto } from './dto/document-query.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Permission } from 'src/auth/decorators/permission.decorator';
import { PermissionGuard } from 'src/auth/guards/permission.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ConfigService } from '@nestjs/config';

@Controller('documents')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly configService: ConfigService,
  ) {}

  // get all documents with pagination and filters
  @Get('list')
  @Public()
  async getAllDocumentsPaginationController(@Query() query: DocumentQueryDto) {
    const docs = await this.documentsService.getAllDocumentsPaginationService(query);

    return docs;
  }

  // get all documents
  @Get()
  @Public()
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
  @Public()
  async getDocumentByIdController(@Param('id', ParseIntPipe) id: number) {
    const doc = await this.documentsService.getDocumentByIdService(id);

    return {
      message: `Berhasil mendapatkan dokumen dengan id ${id}`,
      success: true,
      data: doc,
    };
  }

  // get published document by id
  @Get('publish/:id')
  @Public()
  async getPublishedDocumentByIdController(@Param('id', ParseIntPipe) id: number) {
    const doc = await this.documentsService.getPublishedDocumentByIdService(id);

    return {
      message: `Berhasil mendapatkan dokumen dengan id ${id}`,
      success: true,
      data: doc,
    };
  }

  // get statistik tahunan
  @Get('statistics/yearly')
  @Public()
  async getYearlyStatisticsController() {
    const stats = await this.documentsService.getYearlyStatsService();

    return {
      message: 'Berhasil mendapatkan statistik dokumen tahunan',
      success: true,
      data: stats,
    };
  }

  // get statistik bulanan per tahun
  @Get('statistics/monthly')
  @Public()
  async getMonthlyStatisticsController(@Query('year', ParseIntPipe) year: number) {
    const stats = await this.documentsService.getMonthlyStatsByYearService(year);

    return {
      message: `Berhasil mendapatkan statistik dokumen bulanan untuk tahun ${year}`,
      success: true,
      data: stats,
    };
  }

  // get statistik berdasarkan tipe dokumen
  @Get('statistics/type')
  @Public()
  async getDocumentTypeStatisticsController() {
    const stats = await this.documentsService.getTypeStatsService();

    return {
      message: 'Berhasil mendapatkan statistik dokumen berdasarkan tipe dokumen',
      success: true,
      data: stats,
    };
  }

  // get statistik berdasarkan status dokumen
  @Get('statistics/status')
  @Public()
  async getDocumentStatusStatisticsController() {
    const stats = await this.documentsService.getStatusStatsService();

    return {
      message: 'Berhasil mendapatkan statistik dokumen berdasarkan status dokumen',
      success: true,
      data: stats,
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

  // upload document
  @Post('upload')
  @Permission('dokumen', 'create')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', process.env.UPLOADS_PATH || 'uploads'),
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateDocumentDto,
    @CurrentUser('id') userId: number,
  ) {
    if (!file) {
      throw new BadRequestException('File harus disertakan');
    }

    const fileUrl = `/uploads/${file.filename}`;

    const doc = await this.documentsService.createDocumentService(
      { ...body, file_url: fileUrl },
      userId,
    );

    return {
      message: 'Berhasil mengunggah dan membuat dokumen baru',
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
