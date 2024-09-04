import { BadRequestException, Injectable } from '@nestjs/common';
import * as bycrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Errors } from 'src/shared/utils/error-messages.enum';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  auth(user: User) {
    const payload = { id: user.id, username: user.username };

    return { access_token: this.jwtService.sign(payload) };
  }

  async login(username: string, password: string) {
    const user = await this.usersService.findOne('username', username);

    if (!user) throw new BadRequestException(Errors.USER_NOT_FOUND);

    const isPasswordValid = await bycrypt.compare(password, user.password);

    if (!isPasswordValid) throw new BadRequestException(Errors.WRONG_DATA);

    return user;
  }

  async register(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
