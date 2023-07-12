import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  UsePipes,
  Body,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { ProductEntity } from './entities/product.entity';
import { ReturnProductDto } from './dtos/returnProduct.dto';
import { CreateProductDto } from './dtos/createProduct.dto';
import { DeleteResult } from 'typeorm';
import { UpdateProductDto } from './dtos/updateProduct.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAllProducts(): Promise<ReturnProductDto[]> {
    return (await this.productService.findAllProducts()).map(
      (product: ProductEntity) => new ReturnProductDto(product),
    );
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async createProduct(
    @Body() createProduct: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.createProduct(createProduct);
  }

  @Roles(UserType.Admin)
  @Delete('/:productId')
  async deleteProduct(
    @Param('productId') productId: number,
  ): Promise<DeleteResult> {
    return this.productService.deleteProduct(productId);
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Put('/:productId')
  async updateProduct(
    @Param('productId') productId: number,
    @Body() updateProduct: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.updateProduct(updateProduct, productId);
  }
}
