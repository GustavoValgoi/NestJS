import { ProductEntity } from '../entities/product.entity';
import { ReturnCategoryDto } from '../../category/dtos/returnCategory.dto';

export class ReturnProductDto {
  id: number;
  name: string;
  image: string;
  height: number;
  width: number;
  diameter: number;
  pLength: number;
  weight: number;
  price: number;
  category?: ReturnCategoryDto;

  constructor(product: ProductEntity) {
    this.id = product.id;
    this.name = product.name;
    this.image = product.image;
    this.price = product.price;
    this.height = product.height;
    this.width = product.width;
    this.diameter = product.diameter;
    this.pLength = product.pLength;
    this.weight = product.weight;
    this.category = product.category
      ? new ReturnCategoryDto(product.category)
      : undefined;
  }
}
