import { categoryMock } from '../../category/__mocks__/category.mock';
import { CountProduct } from '../dtos/countProduct.dto';

export const countProductMock: CountProduct = {
  category_id: categoryMock.id,
  total: 10,
};
