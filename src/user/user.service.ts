import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
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
    try {
      if (!createUserInput) throw new BadRequestException('Incomplete data');

      const { username, email, password } = createUserInput;
      const hashPassword = await bcrypt.hash(password, 10);

      const createdUser = new this.userModel({
        username,
        email,
        password: hashPassword,
      });

      if (!createdUser) {
        throw new BadRequestException('Invalid data');
      }

      return await createdUser.save();
    } catch (err) {
      if (err.code === 11000) {
        if (err.keyPattern && err.keyPattern.username) {
          throw new ConflictException(
            `Username ${createUserInput.username} is already in use.`,
          );
        }
      } else if (err instanceof BadRequestException) {
        throw err;
      } else {
        Logger.error('Error creating user', err.stack);
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  async findById(id: string): Promise<User> {
    try {
      if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');

      const userSearch = await this.userModel.findById({ _id: id });
      if (!userSearch) throw new NotFoundException('User not found');

      return userSearch;
    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof NotFoundException
      ) {
        throw err;
      } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
        throw new BadRequestException('Invalid ID');
      } else {
        Logger.error('Error searching for user', err.stack);
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find();
    } catch (err) {
      Logger.error('Error retrieving users', err.stack);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  public async findBy({
    key,
    value,
  }: {
    key: keyof CreateUserInput;
    value: any;
  }): Promise<User> {
    try {
      const user = await this.userModel.findOne({ [key]: value });
      if (!user)
        throw new NotFoundException(
          'A user with the specified credentials was not found.',
        );
      return user;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      Logger.error('Error searching the database', err.stack);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async searchUserByName(username: string[]): Promise<string[]> {
    try {
      const users: string[] = [];
      for (const value of username) {
        const user = await this.userModel.findOne({
          username: value,
        });

        if (!user) throw new NotFoundException(`Username ${value} not found`);

        users.push(user._id);
      }
      return users;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      Logger.error('Error searching the database', err.stack);
      throw new InternalServerErrorException('Internal server error');
    }
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
      if (!updateData) throw new BadRequestException('Incomplete data');

      if (password && password.length > 0) {
        updateData.password = await this.hashedPassword(
          updateData.password,
          10,
        );
      }
      if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid user ID');
      }
      const user = await this.userModel.findByIdAndUpdate(
        { _id: id },
        updateData,
        { new: true },
      );

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (err) {
      if (
        err instanceof NotFoundException ||
        err instanceof BadRequestException
      ) {
        throw err;
      }
      Logger.error('Error updating user', err.stack);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async deleteUser(idUser: string): Promise<User> {
    try {
      const user = await this.userModel.findByIdAndDelete({ _id: idUser });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }

      Logger.error('Error deleting user', err.stack);
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
