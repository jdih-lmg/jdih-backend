import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from 'src/entities/news.entity';
import { NewsCategory } from 'src/entities/news-categories.entity';
import { User } from 'src/entities/users.entity';
import { ValidationService } from 'src/common/validation.service';
import { AuditLogsService } from 'src/audit-logs/audit-logs.service';
import { AuditLog } from 'src/entities/audit-logs.entity';
import { RoleMenuPermission } from 'src/entities/role-menu-permissions.entity';
import { Menu } from 'src/entities/menus.entity';
import { Action } from 'src/entities/actions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      News,
      NewsCategory,
      User,
      RoleMenuPermission,
      Menu,
      Action,
      AuditLog,
    ]),
  ],
  providers: [NewsService, ValidationService, AuditLogsService],
  controllers: [NewsController],
  exports: [NewsService],
})
export class NewsModule {}
