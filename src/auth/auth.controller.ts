import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService, type AuthResult } from './auth.service';
import type { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

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

  // Endpoint untuk melihat payload user dari JWT (debug & client fetch profil cepat)
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: { user?: { userId: number | string; email: string; role: string | null } }) {
    const user = req.user || null;
    return {
      message: 'Berhasil mendapatkan profil user dari token',
      success: true,
      data: user,
    };
  }
}
