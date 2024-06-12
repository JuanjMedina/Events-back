import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEventInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  location: string;

  @Field()
  startDate: string;

  @Field()
  endDate: string;

  @Field({ nullable: true })
  organizer?: string;

  @Field(() => [String], { nullable: true })
  participants?: string[];
}
