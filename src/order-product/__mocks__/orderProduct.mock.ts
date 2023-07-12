import { orderMock } from '../../order/__mocks__/order.mock';
import { OrderProductEntity } from '../entities/order-product.entity';
import { productMock } from '../../product/__mocks__/product.mock';

export const orderProductMock: OrderProductEntity = {
  id: 45,
  amount: 2,
  orderId: orderMock.id,
  price: productMock.price,
  productId: productMock.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};
