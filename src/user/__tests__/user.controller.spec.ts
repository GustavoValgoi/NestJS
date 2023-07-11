import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { userEntityMock } from '../__mocks__/user.mock';
import { ReturnUserDto } from '../dtos/returnUser.dto';
import { updatePasswordMock } from '../__mocks__/updatePassUser.dto';
import { createUserMock } from '../__mocks__/createUser.mock';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getAllUser: jest
              .fn()
              .mockResolvedValue([new ReturnUserDto(userEntityMock)]),
            getUserByIdUsignRelations: jest
              .fn()
              .mockResolvedValue(new ReturnUserDto(userEntityMock)),
            updatePasswordUser: jest.fn().mockResolvedValue(userEntityMock),
            createUser: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should return all users', async () => {
    const users = await controller.getAllUser();
    expect(users).toEqual([new ReturnUserDto(userEntityMock)]);
  });

  it('should return user by id', async () => {
    const user = await controller.getUserById(userEntityMock.id);
    expect(user).toEqual(new ReturnUserDto(userEntityMock));
  });

  it('should return success after updated password', async () => {
    const user = await controller.updatePasswordUser(
      updatePasswordMock,
      userEntityMock.id,
    );
    expect(user).toEqual(userEntityMock);
  });

  it('should return success after created user', async () => {
    const user = await controller.createUser(createUserMock);
    expect(user).toEqual(userEntityMock);
  });
});
