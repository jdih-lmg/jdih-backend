import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // Get all users
  @Get()
  async getAllUserController() {
    const data = await this.userService.getAllUserService();
    return {
      message: 'Berhasil mendapatkan semua user',
      success: true,
      data,
    };
  }

  // Get user by id
  @Get(':id')
  async getUserByIdController(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUserByIdService(id);
    return { message: `Berhasil mendapatkan user id ${id}`, success: true, data: user };
  }

  // Create user
  @Post()
  async createUserController(@Body() dto: CreateUserDto) {
    const user = await this.userService.createUserService(dto);
    return { message: 'Berhasil membuat user', success: true, data: user };
  }

  // Update user by id
  @Put(':id')
  async updateUserController(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    const user = await this.userService.updateUserService(id, dto);
    return { message: `Berhasil mengupdate user id ${id}`, success: true, data: user };
  }

  // Delete user by id
  @Delete(':id')
  async delteUserController(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUserService(id);
    return { message: `Berhasil menghapus user id ${id}`, success: true, data: null };
  }
}
