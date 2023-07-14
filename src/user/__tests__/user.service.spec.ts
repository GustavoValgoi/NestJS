import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { userEntityMock } from '../__mocks__/user.mock';
import { createUserMock } from '../__mocks__/createUser.mock';
import {
  updatePasswordInvalidMock,
  updatePasswordMock,
} from '../__mocks__/updatePassUser.dto';
import { UserType } from '../enum/user-type.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(userEntityMock),
            find: jest.fn().mockResolvedValue([userEntityMock]),
            save: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('should return user in findUserByEmail', async () => {
    const user = await service.findUserByEmail(userEntityMock.email);
    expect(user).toEqual(userEntityMock);
  });

  it('should return error in findUserByEmail', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
    expect(
      service.findUserByEmail(userEntityMock.email),
    ).rejects.toThrowError();
  });

  it('should return error in findUserByEmail (Erro DB)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());
    expect(
      service.findUserByEmail(userEntityMock.email),
    ).rejects.toThrowError();
  });

  it('should return user in findUserById', async () => {
    const user = await service.findUserById(userEntityMock.id);
    expect(user).toEqual(userEntityMock);
  });

  it('should return error in findUserById', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
    expect(service.findUserById(userEntityMock.id)).rejects.toThrowError();
  });

  it('should return error in findUserById (Erro DB)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());
    expect(service.findUserById(userEntityMock.id)).rejects.toThrowError();
  });

  it('should return user in getUserByIdUsignRelations', async () => {
    const user = await service.getUserByIdUsignRelations(userEntityMock.id);
    expect(user).toEqual(userEntityMock);
  });

  it('should return user if user not exists', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
    const user = await service.createUser(createUserMock);
    expect(user).toEqual(userEntityMock);
  });

  it('should return user in update password', async () => {
    const user = await service.updatePasswordUser(
      updatePasswordMock,
      userEntityMock.id,
    );
    expect(user).toEqual(userEntityMock);
  });

  it('should return password invalid in error', async () => {
    expect(
      service.updatePasswordUser(updatePasswordInvalidMock, userEntityMock.id),
    ).rejects.toThrowError();
  });

  it('should return error in user not exists', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    expect(
      service.updatePasswordUser(updatePasswordMock, userEntityMock.id),
    ).rejects.toThrowError();
  });

  it('should return save admin user', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
    const spy = jest.spyOn(userRepository, 'save');
    const user = await service.createUser(createUserMock, UserType.Admin);

    expect(user).toEqual(userEntityMock);
    expect(spy.mock.calls[0][0].type_user).toEqual(UserType.Admin);
  });

  it('should return error in exception in save user', async () => {
    jest.spyOn(userRepository, 'save').mockRejectedValue(new Error());

    expect(
      service.createUser(createUserMock, UserType.Admin),
    ).rejects.toThrowError(BadRequestException);
  });

  it('should return list of all users', async () => {
    const users = await service.getAllUser();

    expect(users).toEqual([userEntityMock]);
  });

  it('should return list of all users empty', async () => {
    jest.spyOn(userRepository, 'find').mockResolvedValue([]);

    expect(service.getAllUser()).rejects.toThrowError(NotFoundException);
  });
});
