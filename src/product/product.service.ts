import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { ProductEntity } from './entities/product.entity';
import { DeleteResult, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dtos/createProduct.dto';
import { CategoryService } from '../category/category.service';
import { UpdateProductDto } from './dtos/updateProduct.dto';
import { CountProduct } from './dtos/countProduct.dto';
import { SizeProductDTO } from '../correios/dtos/sizeProduct.dto';
import { CorreiosService } from '../correios/correios.service';
import { cdServiceEnum } from '../correios/enums/cdService.enum';
import { ReturnPriceDeliveryDto } from './dtos/returnPriceDelivery.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    private readonly correiosService: CorreiosService,
  ) {}

  async findAllProducts(
    productId?: number[],
    isRelations?: boolean,
  ): Promise<ProductEntity[]> {
    let findOptions = {};

    if (productId && productId.length > 0) {
      findOptions = {
        where: {
          id: In(productId),
        },
      };
    }

    if (isRelations) {
      findOptions = {
        ...findOptions,
        relations: {
          category: true,
        },
      };
    }

    const products = await this.productRepository.find(findOptions);

    if (!products || !products.length) {
      throw new NotFoundException('Products not found.');
    }

    return products;
  }

  async findProductById(
    id: number,
    isRelations?: boolean,
  ): Promise<ProductEntity> {
    const relations = isRelations ? { category: true } : undefined;

    const product = await this.productRepository.findOne({
      where: { id },
      relations,
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return product;
  }

  async createProduct(createProduct: CreateProductDto): Promise<ProductEntity> {
    await this.categoryService.findCategoryById(createProduct.categoryId);

    return this.productRepository.save({
      ...createProduct,
      diameter: createProduct.diameter || 0,
      height: createProduct.height || 0,
      pLength: createProduct.pLength || 0,
      weight: createProduct.weight || 0,
      width: createProduct.width || 0,
    });
  }

  async deleteProduct(productId: number): Promise<DeleteResult> {
    await this.findProductById(productId);

    return this.productRepository.delete({ id: productId });
  }

  async updateProduct(
    updateProduct: UpdateProductDto,
    productId: number,
  ): Promise<ProductEntity> {
    const product = await this.findProductById(productId);

    return this.productRepository.save({ ...product, ...updateProduct });
  }

  async countProductsByCategoryId(): Promise<CountProduct[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .select('product.category_id, COUNT(*) as total')
      .groupBy('product.category_id')
      .getRawMany();
  }

  async findPriceDelivery(
    cep: string,
    idProduct: number,
  ): Promise<ReturnPriceDeliveryDto> {
    const product = await this.findProductById(idProduct);

    const sizeProduct = new SizeProductDTO(product);

    const resultPrice = await Promise.all([
      this.correiosService.priceDelivery(cdServiceEnum.PAC, cep, sizeProduct),
      this.correiosService.priceDelivery(cdServiceEnum.SEDEX, cep, sizeProduct),
      this.correiosService.priceDelivery(
        cdServiceEnum.SEDEX10,
        cep,
        sizeProduct,
      ),
    ]).catch(() => {
      throw new BadRequestException('Error in find price delivery.');
    });

    return new ReturnPriceDeliveryDto(resultPrice);
  }
}
