import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuditLogsService } from './audit-logs.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/entities/roles.entity';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.ADMIN)
  async getAuditLogs(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('action') action?: string,
    @Query('entity') entity?: string,
    @Query('user_id') user_id?: string,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
  ) {
    return this.auditLogsService.getAllAuditLogs({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      action,
      entity,
      user_id: user_id ? parseInt(user_id) : undefined,
      start_date: start_date ? new Date(start_date) : undefined,
      end_date: end_date ? new Date(end_date) : undefined,
    });
  }

  // get audit log by id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.ADMIN)
  async getAuditLogById(@Query('id') id: string) {
    const res = await this.auditLogsService.getAuditLogById(parseInt(id));

    return {
      message: 'Audit log berhasil diambil',
      success: true,
      res,
    };
  }

  // get audit log by user id
  @Get('user/:user_id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.ADMIN)
  async getAuditLogsByUserId(@Query('user_id') user_id: string) {
    const res = await this.auditLogsService.getAuditLogsByUserId(parseInt(user_id));

    return {
      message: 'Audit logs berhasil diambil',
      success: true,
      res,
    };
  }

  // get audit logs by entity id
  @Get('entity/:entity_id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.ADMIN)
  async getAuditLogsByEntityId(
    @Query('entity') entity: string,
    @Query('entity_id') entity_id: number,
  ) {
    const res = await this.auditLogsService.getAuditLogsByEntityId(entity, entity_id);

    return {
      message: 'Audit logs berhasil diambil',
      success: true,
      res,
    };
  }
}
