import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './entities/event.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    private readonly userService: UserService,
  ) {}

  async create(createEventInput: CreateEventInput): Promise<Event> {
    const { participants } = createEventInput;
    const users = await this.userService.searchUserByName(participants);

    const newEvent = new this.eventModel({
      ...createEventInput,
      participants: users,
    });
    return newEvent.save();
  }

  async findAll(): Promise<Event[]> {
    return await this.eventModel.find();
  }

  async findOne(id: string): Promise<Event> {
    const eventSearch = await this.eventModel.findOne({
      _id: id,
    });
    if (!eventSearch)
      throw new HttpException('Evento no encontrado', HttpStatus.NOT_FOUND);

    return eventSearch;
  }

  async remove(id: string): Promise<Event> {
    const eventRemove = await this.eventModel.findOneAndDelete({
      _id: id,
    });
    if (!eventRemove)
      throw new HttpException('Evento no encontrado!', HttpStatus.NOT_FOUND);
    return eventRemove;
  }
}
