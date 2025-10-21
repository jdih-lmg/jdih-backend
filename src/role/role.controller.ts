import { Body, Controller, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Permission } from 'src/auth/decorators/permission.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // get all roles with permissions
  @Get()
  @Permission('roles', 'manage')
  async getAllRolesWithPermissions() {
    const data = await this.roleService.getAllRolesWithPermissions();

    return {
      message: 'Berhasil mengambil data roles beserta izin',
      success: true,
      data,
    };
  }

  // update izin role
  @Put(':roleId/permissions')
  @Permission('roles', 'manage')
  async updateRolePermissions(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() body: { permissions: { menu: string; actions: string[] }[] },
  ) {
    const data = await this.roleService.updateRolePermissions(roleId, body.permissions);

    return {
      message: 'Berhasil memperbarui izin role',
      success: true,
      data,
    };
  }

  // update role user
  @Put('assign/:userId')
  @Permission('roles', 'manage')
  async updateRoleUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: { role_id: number },
  ) {
    const data = await this.roleService.updateRoleUser(userId, body.role_id);

    return {
      message: 'Berhasil memperbarui role user',
      success: true,
      data,
    };
  }
}
