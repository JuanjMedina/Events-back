import { SetMetadata } from '@nestjs/common';
import { KeysDecorator } from 'src/constants/decorator.keys';
import { ROLES } from 'src/constants/roles';
export const RoleAccess = (...roles: Array<keyof typeof ROLES>) =>
  SetMetadata(KeysDecorator.ROLES_KEY, roles);
