import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document } from 'src/entities/documents.entity';
import { DocumentVersion } from 'src/entities/document-versions.entity';
import { DocumentVersionsController } from './document-versions/document-versions.controller';
import { DocumentVersionsService } from './document-versions/document-versions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Document, DocumentVersion])],
  controllers: [DocumentsController, DocumentVersionsController],
  providers: [DocumentsService, DocumentVersionsService],
})
export class DocumentsModule {}
