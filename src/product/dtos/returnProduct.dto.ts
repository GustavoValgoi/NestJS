import { ProductEntity } from '../entities/product.entity';

export class ReturnProductDto {
  id: number;
  name: string;
  image: string;
  price: number;

  constructor(product: ProductEntity) {
    this.id = product.id;
    this.name = product.name;
    this.image = product.image;
    this.price = product.price;
  }
}
