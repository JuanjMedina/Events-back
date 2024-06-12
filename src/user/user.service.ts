import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { InjectModel } from '@nestjs/mongoose';
import { User, userDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginUserInput } from './dto/login-user.input';
import { randomUUID } from 'crypto';

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

  async findAll() {
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

  async validateUser(loginUserInput: LoginUserInput): Promise<User> {
    const { password, email, username } = loginUserInput;
    const userByUsername = await this.findBy({
      key: 'username',
      value: username,
    });

    const userByEmail = await this.findBy({
      key: 'email',
      value: email,
    });

    if (userByEmail) {
      const match = await bcrypt.compare(password, userByEmail.password);
      if (match) return userByEmail;
    }
    if (userByUsername) {
      const match = await bcrypt.compare(password, userByUsername.password);
      if (match) return userByUsername;
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

  async generateJWT(user: User): Promise<string> {
    const payload = {
      ...user,
      random: randomUUID(),
    };
    return jwt.sign(payload, process.env.SECRET_JWT, {
      expiresIn: '1h',
    });
  }
}
