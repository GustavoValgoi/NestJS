import { cartMock } from '../../cart/__mocks__/cart.mock';
import { CartProductEntity } from '../entities/cart-product.entity';
import { productMock } from '../../product/__mocks__/product.mock';

export const cartProductMock: CartProductEntity = {
  id: 1212,
  productId: productMock.id,
  cartId: cartMock.id,
  amount: 5,
  createdAt: new Date(),
  updatedAt: new Date(),
};
