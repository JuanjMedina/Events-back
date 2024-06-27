import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { InjectModel } from '@nestjs/mongoose';
import { User, userDocument } from './entities/user.entity';
import { Model, isValidObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<userDocument>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const { username, email, password } = createUserInput;
    const hashPassword = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({
      username,
      email,
      password: hashPassword,
    });
    return createdUser.save();
  }

  async findById(id: string): Promise<User> {
    try {
      const userSearch = await this.userModel.findById({ _id: id });
      if (!userSearch)
        throw new HttpException('User not found ', HttpStatus.FORBIDDEN);
      return userSearch;
    } catch (Err) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  public async findBy({
    key,
    value,
  }: {
    key: keyof CreateUserInput;
    value: any;
  }): Promise<User> {
    try {
      const user = this.userModel.findOne({
        [key]: value,
      });
      return user;
    } catch (err) {
      throw new Error('Error consultando en la BD ');
    }
  }

  async searchUserByName(username: string[]): Promise<string[]> {
    const users: string[] = [];
    for (const value of username) {
      const user = await this.userModel.findOne({
        username: value,
      });
      if (user) {
        users.push(user._id);
      }
    }
    return users;
  }

  async hashedPassword(password: string, interval: number) {
    try {
      return await bcrypt.hash(password, interval);
    } catch (err) {
      console.error('Error hashing password:', err);
      throw err;
    }
  }

  async updateUser(updateUserInput: UpdateUserInput, id: string) {
    try {
      const updateData = updateUserInput;
      const { password } = updateData;

      if (password && password.length > 0) {
        updateData.password = await this.hashedPassword(
          updateData.password,
          10,
        );
      }
      if (!isValidObjectId(id)) {
        throw new NotFoundException('Invalid user id ');
      }
      const user = await this.userModel.findByIdAndUpdate(
        { _id: id },
        updateData,
        { new: true },
      );

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return user;
    } catch (err) {
      console.error('Error al actualizar el usuario:', err.message);
      throw err;
    }
  }

  async deleteUser(idUser: string): Promise<User> {
    try {
      const user = await this.userModel.findByIdAndDelete({ _id: idUser });
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
      return user;
    } catch (err) {
      throw err;
    }
  }
}
