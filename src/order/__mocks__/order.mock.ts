import { OrderEntity } from '../entities/order.entity';
import { addressMock } from '../../address/__mocks__/address.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { paymentMock } from '../../payment/__mocks__/payment.mock';

export const orderMock: OrderEntity = {
  id: 656,
  userId: userEntityMock.id,
  addressId: addressMock.id,
  paymentId: paymentMock.id,
  date: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};
