import { categoryMock } from '../../category/__mocks__/category.mock';
import { CreateProductDto } from '../dtos/createProduct.dto';

export const createProductMock: CreateProductDto = {
  categoryId: categoryMock.id,
  image: 'http://images.com/image',
  name: 'Product name',
  price: 10,
};
