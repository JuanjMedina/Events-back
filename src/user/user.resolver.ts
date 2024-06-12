import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';

import { LoginUserInput } from './dto/login-user.input';
import { LoginUserResponse } from './dto/login-user.response';
import { UnauthorizedException } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User, {
    description: 'Create a user ',
  })
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Mutation(() => LoginUserResponse, {
    description: 'Login a user and return JWT and user data',
  })
  async loginUser(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
  ): Promise<LoginUserResponse> {
    const user = await this.userService.validateUser(loginUserInput);
    if (!user) throw new UnauthorizedException('Data no valida');
    const generateJWT = await this.userService.generateJWT(user);
    return { user, token: generateJWT };
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  // @Query(() => User, { name: 'user' })
  // findOne(@Args('username') username: string) {
  //   return this.userService.findOne(username);
  // }
}
