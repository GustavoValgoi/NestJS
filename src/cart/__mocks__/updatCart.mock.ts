import { productMock } from '../../product/__mocks__/product.mock';
import { UpdateCartDto } from '../dtos/updateCart.dto';

export const updateCartMock: UpdateCartDto = {
  productId: productMock.id,
  amount: 2,
};
