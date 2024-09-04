import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Errors } from 'src/shared/utils/error-messages.enum';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, username } = createUserDto;

    const user = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (user) {
      throw new ConflictException(Errors.USER_EXIST);
    }

    const hashedPassword = await this.hashPassword(password);

    return this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  findOne(key: string, param: any): Promise<User> {
    return this.userRepository.findOneBy({ [key]: param });
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    const { email, password, username } = updateUserDto;

    const user = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (user) {
      throw new ConflictException(Errors.USER_EXIST);
    }

    try {
      const hashedPassword = await this.hashPassword(password);

      await this.userRepository.update(id, {
        ...updateUserDto,
        password: hashedPassword,
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...updatedUser } =
        await this.userRepository.findOneBy({ id });

      return updatedUser;
    } catch (_) {
      throw new BadRequestException(Errors.WRONG_DATA);
    }
  }

  findWithWishes(id: number) {
    return this.userRepository.find({
      relations: { wishes: true },
      where: { id },
    });
  }

  async findMany(query: string) {
    const findOperator = Like(`%${query}`);

    const searchResult = await this.userRepository.find({
      where: [{ email: findOperator }, { username: findOperator }],
    });

    return searchResult;
  }
}
