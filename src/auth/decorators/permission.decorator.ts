import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { PermissionGuard } from '../guards/permission.guard';

export const Permission = (menu: string, action: string) =>
  applyDecorators(
    SetMetadata('menu', menu),
    SetMetadata('action', action),
    UseGuards(PermissionGuard),
  );
