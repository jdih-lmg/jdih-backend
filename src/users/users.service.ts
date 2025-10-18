import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationService } from 'src/common/validation.service';
import { Role } from 'src/entities/roles.entity';
import { User } from 'src/entities/users.entity';
import { Repository, Not, IsNull } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto, UpdateUserSchema } from './dto/update-user.dto';
import { AuditAction, AuditLogsService } from 'src/audit-logs/audit-logs.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    private readonly auditLogsService: AuditLogsService,
    private readonly validation: ValidationService,
  ) {}

  // Get all users
  async getAllUserService(): Promise<User[]> {
    // Default: TypeORM otomatis exclude yang soft deleted
    return this.userRepo.find({ relations: ['role'] });
  }

  // Get user by id
  async getUserByIdService(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id }, relations: ['role'] });

    if (!user) throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);

    return user;
  }

  // Update user by id
  async updateUserService(id: number, data: UpdateUserDto, userId?: number): Promise<User> {
    const dto = this.validation.validate(UpdateUserSchema, data);
    const target = await this.getUserByIdService(id);

    const oldData = JSON.parse(JSON.stringify(target)) as User;

    if (dto.roleId) {
      const role = await this.roleRepo.findOne({ where: { id: dto.roleId } });

      if (!role) throw new NotFoundException(`Role dengan id ${dto.roleId} tidak ditemukan`);

      target.role = role;
      target.updated_by = userId;
    }

    if (dto.name) target.name = dto.name;
    if (dto.email) target.email = dto.email;
    // cek apakah password perlu di-hash ulang
    if (dto.password) {
      const incoming = dto.password;
      const looksLikeBcrypt = incoming.length === 60 && incoming.startsWith('$2');
      if (!looksLikeBcrypt) {
        const sameAsOld = await bcrypt.compare(incoming, target.password_hash).catch(() => false);
        if (!sameAsOld) {
          target.password_hash = await bcrypt.hash(
            incoming,
            Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
          );
        }
      }
    }

    const updated = this.userRepo.save(target);

    await this.auditLogsService.logAction(
      { id: userId || 0 },
      AuditAction.UPDATE,
      'User',
      (await updated).id,
      oldData,
      updated,
    );

    return updated;
  }

  // Delete user by id
  async deleteUserService(id: number, userId?: number): Promise<User> {
    const user = await this.getUserByIdService(id);

    if (userId !== undefined) {
      user.deleted_by = userId;
    }

    const deleted = this.userRepo.softRemove(user);

    await this.auditLogsService.logAction(
      { id: userId || 0 },
      AuditAction.DELETE,
      'User',
      (await deleted).id,
      user,
      null,
    );

    return deleted;
  }

  // Ambil semua user yang sudah di-soft delete
  async getDeletedUsers(): Promise<User[]> {
    return this.userRepo.find({
      withDeleted: true,
      where: { deleted_at: Not(IsNull()) },
      relations: ['role'],
    });
  }

  // Mengembalikan user yang sudah soft deleted
  async restoreUserService(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      withDeleted: true,
      relations: ['role'],
    });

    if (!user) throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);
    if (!user.deleted_at) {
      throw new BadRequestException(`User id ${id} tidak dalam status terhapus`);
    }

    await this.userRepo.restore(id);

    return this.getUserByIdService(id);
  }
}
