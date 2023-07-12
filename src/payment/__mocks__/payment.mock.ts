import { PaymentEntity } from '../entities/payment.entity';

export const paymentMock: PaymentEntity = {
  id: 654,
  discount: 0,
  price: 100,
  finalPrice: 100,
  statusId: 12,
  type: 'type payment',
  createdAt: new Date(),
  updatedAt: new Date(),
};
