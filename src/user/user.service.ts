import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/createUser.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from './enum/user-type.enum';
import { UpdatePasswordDto } from './dtos/updatePassword.dto';
import { createPasswordHashed, validatePassword } from '../utils/validate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(
    createUserDTO: CreateUserDTO,
    userType?: number,
  ): Promise<UserEntity> {
    const user = await this.findUserByEmail(createUserDTO.email).catch(
      () => undefined,
    );

    if (user) {
      throw new BadRequestException('Email already exists.');
    }

    const hashPassword = await createPasswordHashed(createUserDTO.password);

    return this.usersRepository.save({
      ...createUserDTO,
      type_user: userType ? userType : UserType.User,
      password: hashPassword,
    });
  }

  async getUserByIdUsignRelations(userId: number): Promise<UserEntity> {
    return this.usersRepository.findOne({
      where: { id: userId },
      relations: {
        addresses: {
          city: {
            state: true,
          },
        },
      },
    });
  }

  async getAllUser(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async findUserById(userId: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('UserId not found.');
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('UserId not found.');
    }

    return user;
  }

  async updatePasswordUser(
    updatePassDto: UpdatePasswordDto,
    userId: number,
  ): Promise<UserEntity> {
    const user = await this.findUserById(userId);
    const passwordHashed = await createPasswordHashed(
      updatePassDto.newPassword,
    );

    const isMatch = await validatePassword(
      updatePassDto.lastPassword,
      user.password,
    );

    if (!isMatch) {
      throw new BadRequestException('Last password invalid.');
    }

    return this.usersRepository.save({
      ...user,
      password: passwordHashed,
    });
  }
}
