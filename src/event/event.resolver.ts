import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EventService } from './event.service';
import { Event } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';

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

  @Mutation(() => Event)
  async removeParticipants(
    @Args('id') id: string,
    @Args('removeParticipantsInput', { type: () => [String] })
    removeParticipantsDto: string[],
  ): Promise<Event> {
    try {
      return this.eventService.removeParticipants(id, removeParticipantsDto);
    } catch (err) {
      throw new Error('error');
    }
  }

  @Mutation(() => Event)
  async updateEvent(
    @Args('updateEventInput') updateEventInput: UpdateEventInput,
    @Args('id') id: string,
  ): Promise<Event> {
    try {
      return this.eventService.updateEvent(updateEventInput, id);
    } catch (err) {
      throw new Error('Error ');
    }
  }

  // @Query(() => Event, { name: 'event' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.eventService.findOne(id);
  // }
}
