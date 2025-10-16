import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/entities/roles.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
