import { Injectable } from '@nestjs/common';
import { LoginUserInput } from 'src/user/dto/login-user.input';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PayloadToken } from './interfaces/auth.interfaces';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(loginUserInput: LoginUserInput): Promise<User> {
    const { password, email, username } = loginUserInput;
    const userByUsername = await this.userService.findBy({
      key: 'username',
      value: username,
    });

    const userByEmail = await this.userService.findBy({
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

  async generateJWT(user: User): Promise<string> {
    const payload: PayloadToken = {
      UserId: user._id,
      role: user.roles,
    };
    return jwt.sign(payload, process.env.SECRET_JWT, {
      expiresIn: '1h',
    });
  }
}
