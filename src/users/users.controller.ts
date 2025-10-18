import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/users.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RoleEnum } from 'src/entities/roles.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // mapping response user object
  private toUserResponse(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
        ? { id: user.role.id, name: user.role.name, description: user.role.description }
        : null,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      // tidak expose deletedAt kecuali endpoint khusus
    };
  }

  // mapping response users array
  private toUsersResponse(users: User[]) {
    return users.map((user) => this.toUserResponse(user));
  }

  // Get all users
  @Get()
  async getAllUserController() {
    const data = await this.userService.getAllUserService();

    return {
      message: 'Berhasil mendapatkan semua user',
      success: true,
      data: this.toUsersResponse(data),
    };
  }

  // Get user by id
  @Get(':id')
  async getUserByIdController(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUserByIdService(id);

    return {
      message: `Berhasil mendapatkan user id ${id}`,
      success: true,
      data: this.toUserResponse(user),
    };
  }

  // Update user by id
  @Put(':id')
  async updateUserController(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser('userId') userId: number,
  ) {
    const user = await this.userService.updateUserService(id, dto, userId);

    return {
      message: `Berhasil mengupdate user id ${id}`,
      success: true,
      data: this.toUserResponse(user),
    };
  }

  // Delete user by id (soft delete)
  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  async deleteUserController(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('userId') userId: number,
  ) {
    const user = await this.userService.deleteUserService(id, userId);

    return {
      message: `Berhasil menandai user id ${id} sebagai terhapus`,
      success: true,
      data: {
        name: user.name,
        email: user.email,
      },
    };
  }

  // List user yang sudah soft deleted
  @Get('deleted/list')
  async getDeletedUsers() {
    const users = await this.userService.getDeletedUsers();
    return {
      message: 'Berhasil mendapatkan user terhapus',
      success: true,
      data: users.map((u: User) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        deletedAt: u.deleted_at,
      })),
    };
  }

  // Restore user yang soft deleted
  @Patch(':id/restore')
  @Roles(RoleEnum.ADMIN)
  async restoreUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.restoreUserService(id);
    return {
      message: `Berhasil merestore user id ${id}`,
      success: true,
      data: this.toUserResponse(user),
    };
  }
}
