import { Body, Controller, Post, Get, Req, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // register user
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterDto) {
    const result = await this.authService.register(body);

    return { message: 'Registrasi berhasil', success: true, data: result };
  }

  // login user
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
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
