import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/entities/roles.entity';
import { RoleMenuPermission } from 'src/entities/role-menu-permissions.entity';
import { Menu } from 'src/entities/menus.entity';
import { Action } from 'src/entities/actions.entity';
import { User } from 'src/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RoleMenuPermission, Menu, Action, User])],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
