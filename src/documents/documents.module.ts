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
import { User } from 'src/entities/users.entity';
import { AuditLogsModule } from 'src/audit-logs/audit-logs.module';
import { Menu } from 'src/entities/menus.entity';
import { RoleMenuPermission } from 'src/entities/role-menu-permissions.entity';
import { Action } from 'src/entities/actions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Document,
      DocumentVersion,
      DocumentCategory,
      User,
      Menu,
      RoleMenuPermission,
      Action,
    ]),
    AuditLogsModule,
  ],
  controllers: [DocumentsController, DocumentVersionsController, DocumentCategoryController],
  providers: [DocumentsService, DocumentVersionsService, DocumentCategoryService],
})
export class DocumentsModule {}
