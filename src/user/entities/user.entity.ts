import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ROLES } from 'src/constants/roles';

export type userDocument = HydratedDocument<User>;

registerEnumType(ROLES, {
  name: 'UserRoles',
});

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

  @Prop({ type: [String], enum: ROLES, default: [ROLES.USER] })
  @Field(() => [ROLES])
  roles: ROLES[];
}
export const UserSchema = SchemaFactory.createForClass(User);
