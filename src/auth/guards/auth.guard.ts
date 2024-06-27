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

@Injectable()
export class AuthGuard implements CanActivate {
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

    const ctx =
      GqlExecutionContext.create(context).getContext<ContextGraphql>();
    const { req } = ctx;
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Authorization header not found');
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) throw new UnauthorizedException('Token not found');

    const { exExpired, userid } = useToken(token);
    if (exExpired === true) {
      throw new UnauthorizedException('Token Expired ');
    }
    const user = await this.userService.findById(userid);

    if (!user) throw new UnauthorizedException('Invalid User');

    ctx.roles = user.roles;
    ctx.userid = user._id;
    return true;
  }
}
