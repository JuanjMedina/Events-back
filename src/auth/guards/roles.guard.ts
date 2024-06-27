import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { useToken } from '../utils/use.token';
import { UserService } from 'src/user/user.service';
import { KeysDecorator } from 'src/constants/decorator.keys';
import { Reflector } from '@nestjs/core';
import { ContextGraphql } from '../interfaces/auth.interfaces';
import { ROLES } from 'src/constants/roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      KeysDecorator.PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) return true;

    const roles = this.reflector.get<Array<keyof typeof ROLES>>(
      KeysDecorator.ROLES_KEY,
      context.getHandler(),
    );

    const admin = this.reflector.get<ROLES.ADMIN>(
      KeysDecorator.ADMIN_KEY,
      context.getHandler(),
    );

    const ctx =
      GqlExecutionContext.create(context).getContext<ContextGraphql>();

    const comparationRole = ctx.roles.includes(admin);
    if (roles === undefined) {
      if (!admin) return true;
      else if (admin && comparationRole) return true;
      throw new UnauthorizedException(
        'No tienes permisos para ejecutar la operacion ! ',
      );
    }
    if (roles.includes(ROLES.ADMIN)) return true;

    const isRole = roles.some((role) => ctx.roles.includes(role));
    if (!isRole) throw new UnauthorizedException('No cuentas con los permisos');

    return true;
  }
}
