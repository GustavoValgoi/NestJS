import { userEntityMock } from '../../user/__mocks__/user.mock';
import { CartEntity } from '../entities/cart.entity';

export const cartMock: CartEntity = {
  id: 1,
  userId: userEntityMock.id,
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};
