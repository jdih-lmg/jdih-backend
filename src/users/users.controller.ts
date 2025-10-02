import { Body, Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import type { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // Get all users
  @Get()
  getAllUserController() {
    return this.userService.getAllUserService();
  }

  // Get user by id
  @Get(':id')
  getUserByIdController(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserByIdService(id);
  }

  // Create user
  createUserController(@Body() dto: CreateUserDto) {
    return this.userService.createUserService(dto);
  }

  // Update user by id
  updateUserController(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateUserDto) {
    return this.userService.updateUserService(id, dto);
  }

  // Delete user by id
  delteUserController(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUserService(id);
  }
}
