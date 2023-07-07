import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAllProducts(): Promise<ProductEntity[]> {
    const products = await this.productRepository.find();

    if (!products || !products.length) {
      throw new NotFoundException('Products not found.');
    }

    return this.productRepository.find();
  }
}
