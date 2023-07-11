import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from '../address.controller';
import { AddressService } from '../address.service';
import { createAddressMock } from '../__mocks__/createAddress.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { addressMock } from '../__mocks__/address.mock';
import { ReturnAddressDTO } from '../dtos/returnAddress.dto';

describe('AddressController', () => {
  let controller: AddressController;
  let addressService: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        {
          provide: AddressService,
          useValue: {
            createAddress: jest.fn().mockResolvedValue(addressMock),
            findAddressesByUserId: jest
              .fn()
              .mockResolvedValue([new ReturnAddressDTO(addressMock)]),
          },
        },
      ],
    }).compile();

    controller = module.get<AddressController>(AddressController);
    addressService = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(addressService).toBeDefined();
  });

  it('should return address entity in createAddress', async () => {
    const address = await controller.createAddress(
      createAddressMock,
      userEntityMock.id,
    );

    expect(address).toEqual(addressMock);
  });

  it('should return addresses by user id', async () => {
    const addresses = await controller.findAddressesByUserId(userEntityMock.id);

    expect(addresses).toEqual([new ReturnAddressDTO(addressMock)]);
  });
});
