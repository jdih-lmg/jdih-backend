import { Module } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from 'src/entities/audit-logs.entity';
import { AuditLogsController } from './audit-logs.controller';
import { RoleMenuPermission } from 'src/entities/role-menu-permissions.entity';
import { Menu } from 'src/entities/menus.entity';
import { Action } from 'src/entities/actions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog, RoleMenuPermission, Menu, Action])],
  providers: [AuditLogsService],
  exports: [AuditLogsService],
  controllers: [AuditLogsController],
})
export class AuditLogsModule {}
