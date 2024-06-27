import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './entities/event.entity';
import { UserService } from 'src/user/user.service';
import { UpdateEventInput } from './dto/update-event.input';
import { UpdateEvent } from './interfaces/interfaces';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    private readonly userService: UserService,
  ) {}

  async create(createEventInput: CreateEventInput): Promise<Event> {
    try {
      const { participants } = createEventInput;
      const users = await this.userService.searchUserByName(participants);
      // if (!users)
      //   throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);

      const newEvent = new this.eventModel({
        ...createEventInput,
        participants: users,
      });
      return newEvent.save();
    } catch (Err) {}
  }

  async findAll(): Promise<Event[]> {
    try {
      const events = await this.eventModel.find();
      return events;
    } catch (Err) {}
  }

  async findOne(id: string): Promise<Event> {
    try {
      const eventSearch = await this.eventModel.findOne({
        _id: id,
      });
      if (!eventSearch)
        throw new HttpException('Evento no encontrado', HttpStatus.NOT_FOUND);

      return eventSearch;
    } catch (Err) {}
  }

  async remove(id: string): Promise<Event> {
    try {
      const eventRemove = await this.eventModel.findOneAndDelete({
        _id: id,
      });
      if (!eventRemove)
        throw new HttpException('Evento no encontrado!', HttpStatus.NOT_FOUND);
      return eventRemove;
    } catch (Err) {}
  }

  async removeParticipants(id: string, removeParticipantsDto: string[]) {
    try {
      const usersArray: string[] = [];

      // Obtener los IDs de los usuarios a eliminar
      for (const participant of removeParticipantsDto) {
        const user = await this.userService.findById(participant);
        if (user) {
          usersArray.push(user._id); // Si el usuario existe, añadir su _id al array
        } else {
          // Manejar el caso cuando el usuario no existe
          throw new Error(`El usuario con ID ${participant} no existe.`);
        }
      }

      // Obtener el evento por su ID
      const eventFind = await this.eventModel.findById(id);

      if (!eventFind) {
        throw new NotFoundException(
          `El evento con ID '${id}' no fue encontrado.`,
        );
      }

      // Filtrar los participantes para eliminar los usuarios correspondientes
      const updateParticipants = eventFind.participants.filter(
        (participant) => !usersArray.includes(participant.toString()),
      );

      // Actualizar el evento con los nuevos participantes
      const updateEvent = {
        participants: updateParticipants,
      };

      // Actualizar el evento en la base de datos
      const updatedEvent = await this.eventModel.findByIdAndUpdate(
        id,
        updateEvent,
        { new: true },
      );

      return updatedEvent;
    } catch (err) {
      // Manejar errores específicos aquí
      if (err.name === 'CastError' && err.kind === 'ObjectId') {
        // Personalizar el mensaje de error para CastError de ObjectId
        throw new NotFoundException(
          `El ID '${id}' proporcionado no es válido.`,
        );
      }

      // Re-lanzar otros errores no manejados explícitamente
      throw err;
    }
  }

  async updateEvent(
    updateEventInput: UpdateEventInput,
    id: string,
  ): Promise<Event> {
    console.log(
      `updateEventInput: ${JSON.stringify(updateEventInput)}, id: ${id}`,
    );
    try {
      const { participants, ...updateData } = updateEventInput;
      const verifyParticipants: string[] = [];
      const updateEvent: UpdateEvent = updateData;
      if (participants && participants.length > 0) {
        for (const participant of participants) {
          const user = await this.userService.findById(participant);
          if (user) {
            verifyParticipants.push(user._id); // Si el usuario existe, añadir su _id al array
          } else {
            // Manejar el caso cuando el usuario no existe
            throw new Error(`El usuario con ID ${participant} no existe.`);
          }
        }
        updateEvent.participants = verifyParticipants; // Añadir participantes verificados a los datos de actualización
      }

      // Ejecutar la consulta de actualización
      const modelUpdate = await this.eventModel.findOneAndUpdate(
        { _id: id },
        updateData,
        { new: true }, // Devuelve el documento actualizado
      );

      console.log(await modelUpdate.validate);

      if (!modelUpdate) {
        throw new Error(`Evento con ID ${id} no encontrado.`);
      }

      return modelUpdate;
    } catch (err) {
      // throw new Error('No se pudo actualizar el evento');
    }
  }
}
