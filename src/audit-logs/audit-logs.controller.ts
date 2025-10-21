import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuditLogsService } from './audit-logs.service';
import { Permission } from 'src/auth/decorators/permission.decorator';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @Permission('audit-logs', 'read')
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
  @Permission('audit-logs', 'read')
  async getAuditLogById(@Param('id') id: string) {
    return await this.auditLogsService.getAuditLogById(parseInt(id));
  }

  // get audit log by user id
  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @Permission('audit-logs', 'read')
  async getAuditLogsByUserId(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.auditLogsService.getAuditLogsByUserId(parseInt(userId), page, limit);
  }

  // get audit logs by entity id
  @Get('entity/:entity/:entityId')
  @HttpCode(HttpStatus.OK)
  @Permission('audit-logs', 'read')
  async getAuditLogsByEntityId(
    @Param('entity') entity: string,
    @Param('entityId') entityId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.auditLogsService.getAuditLogsByEntityId(entity, entityId, page, limit);
  }
}
