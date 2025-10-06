import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document } from 'src/entities/documents.entity';
import { DocumentVersion } from 'src/entities/document-versions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, DocumentVersion])],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
