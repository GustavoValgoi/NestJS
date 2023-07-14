import { ProductEntity } from '../../product/entities/product.entity';

export class SizeProductDTO {
  weight: number;
  pLength: number;
  height: number;
  width: number;
  diameter: number;
  productValue: number;

  constructor(product: ProductEntity) {
    this.weight = product.weight;
    this.pLength = product.pLength;
    this.height = product.height;
    this.width = product.width;
    this.diameter = product.diameter;
    this.productValue = product.price;
  }
}
