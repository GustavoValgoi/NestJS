import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dtos/createUser.dto';
import { UserEntity } from './entities/user.entity';
import { hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    const hashPassword = await hash(createUserDTO.password, 10);

    return this.usersRepository.save({
      ...createUserDTO,
      type_user: 0,
      password: hashPassword,
    });
  }

  async getAllUser(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }
}
