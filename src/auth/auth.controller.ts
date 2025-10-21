import { Body, Controller, Post, Get, Req, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

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
  async login(@Body() body: LoginDto, @Req() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.authService.login(body, req);
  }

  // logout user
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: any, @Req() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.authService.logout(user, req);

    return {
      message: 'Logout Berhasil',
      success: true,
    };
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

  // get all users permissions
  @Get('users/permissions')
  async getAllUsersWithPermissions() {
    const data = await this.authService.getAllUsersWithPermissions();

    return {
      message: 'Berhasil mendapatkan semua user dengan permissions',
      success: true,
      data,
    };
  }
}
