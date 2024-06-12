import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema()
@ObjectType()
export class Event {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true })
  @Field()
  title: string;

  @Prop({ required: true })
  @Field()
  description: string;

  @Prop({ required: true })
  @Field()
  location: string;

  @Prop({ required: true })
  @Field()
  startDate: string;

  @Prop({ required: true })
  @Field()
  endDate: string;

  @Prop()
  @Field({ nullable: true })
  organizer?: string;

  @Prop({ required: true })
  @Field(() => [String], {
    nullable: true,
  })
  participants?: string[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
