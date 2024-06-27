import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginUserInput } from 'src/user/dto/login-user.input';
import { LoginUserResponse } from 'src/user/dto/login-user.response';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { PublicAccess } from './decorator/public.decorator';
import { RoleAccess } from './decorator/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { AdminAccess } from './decorator/admin.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginUserResponse, {
    description: 'Login a user and return JWT and user data',
  })
  async loginUser(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
  ): Promise<LoginUserResponse> {
    const user = await this.authService.validateUser(loginUserInput);
    if (!user) throw new UnauthorizedException('Data no valida');
    const generateJWT = await this.authService.generateJWT(user);
    return { user, token: generateJWT };
  }

  @AdminAccess()
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Query(() => String, { name: 'example' })
  findAll() {
    return 'this is example';
  }
}
