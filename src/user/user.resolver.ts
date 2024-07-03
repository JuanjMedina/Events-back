import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

// import { LoginUserInput } from './dto/login-user.input';
// import { LoginUserResponse } from './dto/login-user.response';
// import { UnauthorizedException } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User, {
    description: 'Create a user ',
  })
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  @Mutation(() => User, {
    description: 'updateUser',
  })
  updateUser(
    @Args('idUser') idUser: string,
    @Args('updatedUser') updatedUserInput: UpdateUserInput,
  ) {
    return this.userService.updateUser(updatedUserInput, idUser);
  }

  @Query(() => User, { name: 'findUser' })
  findUserById(@Args('idUser') idUser: string) {
    return this.userService.findById(idUser);
  }

  @Mutation(() => User, {
    description: 'Delete User ',
  })
  deleteUser(@Args('idUser') idUser: string): Promise<User> {
    return this.userService.deleteUser(idUser);
  }
}
