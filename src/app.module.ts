import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';

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
      entities: ['dist/entities/**/*{.js,.ts}', 'src/entities/**/*{.ts,.js}'],
      autoLoadEntities: true,
    }),
    CommonModule.forRoot(),
    HealthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
