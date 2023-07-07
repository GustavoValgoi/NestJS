import { AddressEntity } from '../entities/address.entity';
import { cityMock } from '../../city/__mocks__/city.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';

export const addressMock: AddressEntity = {
  cep: '83302220',
  id: 12,
  cityId: cityMock.id,
  userId: userEntityMock.id,
  complement: 'infocomple',
  numberAddress: 12,
  updatedAt: new Date(),
  createdAt: new Date(),
};
