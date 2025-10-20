import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from 'src/entities/audit-logs.entity';
import { User } from 'src/entities/users.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class AuditLogsService {
  constructor(@InjectRepository(AuditLog) private readonly auditRepo: Repository<AuditLog>) {}

  // log action
  async logAction(
    user: User | { id: number },
    action: AuditAction,
    entity: string,
    entityId: number,
    oldData?: object | null,
    newData?: object | null,
  ) {
    const log = this.auditRepo.create({
      user_id: user.id,
      action,
      entity,
      entity_id: entityId,
      old_data: oldData || null,
      new_data: newData || null,
    });

    await this.auditRepo.save(log);
  }

  // get all audit logs
  async getAllAuditLogs(filter: {
    page: number;
    limit: number;
    action?: string;
    entity?: string;
    user_id?: number;
    start_date?: Date;
    end_date?: Date;
  }) {
    const where: Record<string, any> = {};

    if (filter.action) where.action = filter.action;
    if (filter.entity) where.entity = filter.entity;
    if (filter.user_id) where.user_id = filter.user_id;

    // handle jarak tanggal
    if (filter.start_date && filter.end_date) {
      where.created_at = Between(new Date(filter.start_date), new Date(filter.end_date));
    } else if (filter.start_date) {
      where.created_at = MoreThanOrEqual(new Date(filter.start_date));
    } else if (filter.end_date) {
      where.created_at = LessThanOrEqual(new Date(filter.end_date));
    }

    const [data, total] = await this.auditRepo.findAndCount({
      where,
      relations: ['user'],
      order: { created_at: 'DESC' },
      skip: (filter.page - 1) * filter.limit,
      take: filter.limit,
    });

    // mapping response data logs
    const mappedData = data.map((log) => ({
      id: log.id,
      action: log.action,
      entity: log.entity,
      entity_id: log.entity_id,
      old_data: log.old_data,
      new_data: log.new_data,
      created_at: log.created_at,
      user: log.user
        ? {
            id: log.user.id,
            name: log.user.name,
            email: log.user.email,
          }
        : null,
    }));

    return {
      message: 'Audit logs berhasil diambil',
      success: true,
      meta: {
        page: filter.page,
        limit: filter.limit,
        total,
        last_page: Math.ceil(total / filter.limit),
      },
      data: mappedData,
    };
  }

  // get audit log by id
  async getAuditLogById(id: number): Promise<AuditLog> {
    const log = await this.auditRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!log) {
      throw new NotFoundException(`Audit log dengan id ${id} tidak ditemukan`);
    }

    return log;
  }

  // get audit logs by user id
  async getAuditLogsByUserId(user_id: number) {
    const logs = await this.auditRepo.find({
      where: { user_id },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });

    return {
      data: logs.map((log) => ({
        id: log.id,
        action: log.action,
        entity: log.entity,
        entity_id: log.entity_id,
        old_data: log.old_data,
        new_data: log.new_data,
        created_at: log.created_at,
        user: log.user
          ? {
              id: log.user.id,
              name: log.user.name,
              email: log.user.email,
            }
          : null,
      })),
    };
  }

  // get audit logs by entity id
  async getAuditLogsByEntityId(entity: string, entity_id: number) {
    const logs = await this.auditRepo.find({
      where: { entity, entity_id },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });

    return {
      data: logs.map((log) => ({
        id: log.id,
        action: log.action,
        entity: log.entity,
        entity_id: log.entity_id,
        old_data: log.old_data,
        new_data: log.new_data,
        created_at: log.created_at,
        user: log.user
          ? {
              id: log.user.id,
              name: log.user.name,
              email: log.user.email,
            }
          : null,
      })),
    };
  }
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VERIFY = 'VERIFY',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}
