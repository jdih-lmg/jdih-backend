import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ValidationService } from 'src/common/validation.service';
import { Role } from 'src/entities/roles.entity';
import { AuditLogsModule } from 'src/audit-logs/audit-logs.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoleMenuPermission } from 'src/entities/role-menu-permissions.entity';
import { Menu } from 'src/entities/menus.entity';
import { Action } from 'src/entities/actions.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([User, Role, RoleMenuPermission, Menu, Action]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'kunci_rahasia_jwt'),
        signOptions: {
          expiresIn: config.get<string | number>('JWT_EXPIRES_IN', '1h'),
        },
      }),
      inject: [ConfigService],
    }),
    AuditLogsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ValidationService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
