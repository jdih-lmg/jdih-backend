import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';
import { User } from './entities/users.entity';
import { Role } from './entities/roles.entity';
import { Menu } from './entities/menus.entity';
import { Action } from './entities/actions.entity';
import { RoleMenuPermission } from './entities/role-menu-permissions.entity';
import { Document } from './entities/documents.entity';
import { DocumentCategory } from './entities/document-categories.entity';
import { DocumentVersion } from './entities/document-versions.entity';
import { AuditLog } from './entities/audit-logs.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      synchronize: false, // ubah false pada production
      entities: [
        User,
        Role,
        Menu,
        Action,
        RoleMenuPermission,
        Document,
        DocumentCategory,
        DocumentVersion,
        AuditLog,
      ],
      autoLoadEntities: true,
    }),
    CommonModule.forRoot(),
    HealthModule,
    UsersModule,
    AuthModule,
    DocumentsModule,
    AuditLogsModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
