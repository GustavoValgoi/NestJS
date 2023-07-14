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
  diameter: 30,
  weight: 30,
  height: 30,
  pLength: 30,
  width: 30,
};
