import { SetMetadata } from '@nestjs/common';
import { KeysDecorator } from 'src/constants/decorator.keys';
export const PublicAccess = () => SetMetadata(KeysDecorator.PUBLIC_KEY, true);
