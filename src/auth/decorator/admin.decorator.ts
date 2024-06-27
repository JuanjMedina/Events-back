import { SetMetadata } from '@nestjs/common';
import { KeysDecorator } from 'src/constants/decorator.keys';
import { ROLES } from 'src/constants/roles';
export const AdminAccess = () =>
  SetMetadata(KeysDecorator.ADMIN_KEY, ROLES.ADMIN);
