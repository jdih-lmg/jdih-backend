import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document } from 'src/entities/documents.entity';
import { DocumentVersion } from 'src/entities/document-versions.entity';
import { DocumentCategory } from 'src/entities/document-categories.entity';
import { DocumentVersionsController } from './document-versions/document-versions.controller';
import { DocumentVersionsService } from './document-versions/document-versions.service';
import { DocumentCategoryService } from './document-category/document-category.service';
import { DocumentCategoryController } from './document-category/document-category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Document, DocumentVersion, DocumentCategory])],
  controllers: [DocumentsController, DocumentVersionsController, DocumentCategoryController],
  providers: [DocumentsService, DocumentVersionsService, DocumentCategoryService],
})
export class DocumentsModule {}
