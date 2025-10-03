import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationService } from 'src/common/validation.service';
import { Role } from 'src/entities/roles.entity';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, CreateUserSchema } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto, UpdateUserSchema } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    private readonly validation: ValidationService,
  ) {}

  // Get all users
  async getAllUserService(): Promise<User[]> {
    return this.userRepo.find({ relations: ['role'] });
  }

  // Get user by id
  async getUserByIdService(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id }, relations: ['role'] });

    if (!user) throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);

    return user;
  }

  // Create user baru
  async createUserService(data: CreateUserDto): Promise<User> {
    const dto = this.validation.validate(CreateUserSchema, data);
    const role = await this.roleRepo.findOne({ where: { id: dto.roleId } });

    if (!role) throw new NotFoundException(`Role dengan id ${dto.roleId} tidak ditemukan`);

    const pwHashed = await bcrypt.hash(dto.password, Number(process.env.BCRYPT_SALT_ROUNDS) || 10);

    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      passwordHash: pwHashed,
      role: role,
    });

    return this.userRepo.save(user);
  }

  // Update user by id
  async updateUserService(id: number, data: UpdateUserDto): Promise<User> {
    const dto = this.validation.validate(UpdateUserSchema, data);
    const user = await this.getUserByIdService(id);

    if (dto.roleId) {
      const role = await this.roleRepo.findOne({ where: { id: dto.roleId } });

      if (!role) throw new NotFoundException(`Role dengan id ${dto.roleId} tidak ditemukan`);

      user.role = role;
    }

    if (dto.name) user.name = dto.name;
    if (dto.email) user.email = dto.email;
    if (dto.password)
      user.passwordHash = await bcrypt.hash(
        dto.password,
        Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
      );

    return this.userRepo.save(user);
  }

  // Delete user by id
  async deleteUserService(id: number): Promise<User> {
    const user = await this.getUserByIdService(id);

    await this.userRepo.remove(user);

    return user;
  }
}
