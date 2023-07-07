import { cityMock } from '../../city/__mocks__/city.mock';
import { CreateAddressDTO } from '../dtos/createAddress.dto';
import { addressMock } from './address.mock';

export const createAddressMock: CreateAddressDTO = {
  cep: addressMock.cep,
  cityId: cityMock.id,
  complement: addressMock.complement,
  numberAddress: 22,
};
