import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type userDocument = HydratedDocument<User>;

@Schema()
@ObjectType()
export class User {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true, unique: true })
  @Field()
  username: string;

  @Prop({ required: true })
  @Field()
  email: string;

  @Prop({ required: true })
  @Field()
  password: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
