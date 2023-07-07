import { categoryMock } from '../../category/__mocks__/category.mock';
import { ProductEntity } from '../entities/product.entity';

export const productMock: ProductEntity = {
  id: 12,
  image: 'image url',
  name: 'product name',
  price: 100,
  categoryId: categoryMock.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};
