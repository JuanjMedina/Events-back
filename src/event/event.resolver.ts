import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EventService } from './event.service';
import { Event } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';

@Resolver(() => Event)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Mutation(() => Event)
  createEvent(
    @Args('createEventInput') createEventInput: CreateEventInput,
  ): Promise<Event> {
    return this.eventService.create(createEventInput);
  }

  @Query(() => [Event], { name: 'events' })
  findAll(): Promise<Event[]> {
    return this.eventService.findAll();
  }

  @Mutation(() => Event)
  removeEvent(@Args('id') id: string): Promise<Event> {
    return this.eventService.remove(id);
  }

  @Query(() => Event, {
    name: 'event',
  })
  findOne(@Args('id') id: string): Promise<Event> {
    return this.eventService.findOne(id);
  }

  // @Query(() => Event, { name: 'event' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.eventService.findOne(id);
  // }
}
