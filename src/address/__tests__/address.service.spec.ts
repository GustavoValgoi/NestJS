import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AddressService } from '../address.service';
import { AddressEntity } from '../entities/address.entity';
import { CityService } from '../../city/city.service';
import { UserService } from '../../user/user.service';
import { addressMock } from '../__mocks__/address.mock';
import { cityMock } from '../../city/__mocks__/city.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { createAddressMock } from '../__mocks__/createAddress.mock';

describe('AddressService', () => {
  let service: AddressService;
  let userService: UserService;
  let cityService: CityService;

  let addressRepository: Repository<AddressEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: CityService,
          useValue: {
            findCityById: jest.fn().mockResolvedValue(cityMock),
          },
        },
        {
          provide: UserService,
          useValue: {
            findUserById: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
        {
          provide: getRepositoryToken(AddressEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(addressMock),
            find: jest.fn().mockResolvedValue([addressMock]),
          },
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    userService = module.get<UserService>(UserService);
    cityService = module.get<CityService>(CityService);
    addressRepository = module.get<Repository<AddressEntity>>(
      getRepositoryToken(AddressEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(cityService).toBeDefined();
    expect(addressRepository).toBeDefined();
  });

  it('should return success createAddress', async () => {
    const address = await service.createAddress(
      createAddressMock,
      userEntityMock.id,
    );
    expect(address).toEqual(addressMock);
  });

  it('should return error in userService', async () => {
    jest.spyOn(userService, 'findUserById').mockRejectedValueOnce(new Error());
    expect(
      service.createAddress(createAddressMock, userEntityMock.id),
    ).rejects.toThrowError();
  });

  it('should return error in cityService', async () => {
    jest.spyOn(cityService, 'findCityById').mockRejectedValueOnce(new Error());
    expect(
      service.createAddress(createAddressMock, userEntityMock.id),
    ).rejects.toThrowError();
  });

  it('should return all addresses to user', async () => {
    const addresses = await service.findAddressesByUserId(userEntityMock.id);
    expect(addresses).toEqual([addressMock]);
  });

  it('should return not found if not address register', async () => {
    jest.spyOn(addressRepository, 'find').mockResolvedValue(undefined);

    expect(
      service.findAddressesByUserId(userEntityMock.id),
    ).rejects.toThrowError();
  });
});
