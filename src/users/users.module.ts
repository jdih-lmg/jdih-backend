import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Role } from 'src/entities/roles.entity';
import { ValidationService } from 'src/common/validation.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [UsersService, ValidationService],
  exports: [UsersService],
})
export class UsersModule {}
