import { Body, Controller, Post } from '@nestjs/common';
import { AuthService, type AuthResult } from './auth.service';
import type { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: LoginDto,
  ): Promise<{ message: string; success: true; data: AuthResult }> {
    const result = await this.authService.login(body);
    return { message: 'Login berhasil', success: true, data: result };
  }
}
