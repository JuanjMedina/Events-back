import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class LoginUserInput {
  @Field(() => String, {
    nullable: true,
  })
  @IsString()
  @IsOptional()
  username?: string;

  @Field(() => String, {
    nullable: true,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @Field(() => String)
  @IsString()
  password: string;
}
