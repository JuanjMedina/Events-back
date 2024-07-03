import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @Field(() => String)
  @IsString({
    message: 'Username is required ',
  })
  @MinLength(5)
  username?: string;

  @IsNotEmpty()
  @Field(() => String)
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @Field(() => String)
  @IsString({
    message: 'Username is required ',
  })
  @MinLength(6)
  password: string;
}
