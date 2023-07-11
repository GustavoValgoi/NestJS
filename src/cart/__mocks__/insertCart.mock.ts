import { productMock } from '../../product/__mocks__/product.mock';
import { InsertCartDto } from '../dtos/insertCart.dto';

export const insertCartMock: InsertCartDto = {
  productId: productMock.id,
  amount: 2,
};
