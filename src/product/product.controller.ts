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
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { ProductEntity } from './entities/product.entity';
import { ReturnProductDto } from './dtos/returnProduct.dto';
import { CreateProductDto } from './dtos/createProduct.dto';
import { DeleteResult } from 'typeorm';
import { UpdateProductDto } from './dtos/updateProduct.dto';
import { ReturnPriceDeliveryDto } from './dtos/returnPriceDelivery.dto';
import { Pagination } from '../dtos/pagination.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAllProducts(): Promise<ReturnProductDto[]> {
    return (await this.productService.findAllProducts([], true)).map(
      (product: ProductEntity) => new ReturnProductDto(product),
    );
  }

  @Get('/page')
  async findAllPage(
    @Query('search') search?: string,
    @Query('size') size?: number,
    @Query('page') page?: number,
  ): Promise<Pagination<ReturnProductDto[]>> {
    return this.productService.findAllPage(search, size, page);
  }

  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Post()
  async createProduct(
    @Body() createProduct: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.createProduct(createProduct);
  }

  @Roles(UserType.Admin, UserType.Root)
  @Delete('/:productId')
  async deleteProduct(
    @Param('productId') productId: number,
  ): Promise<DeleteResult> {
    return this.productService.deleteProduct(productId);
  }

  @Roles(UserType.Admin, UserType.Root)
  @UsePipes(ValidationPipe)
  @Put('/:productId')
  async updateProduct(
    @Param('productId') productId: number,
    @Body() updateProduct: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.updateProduct(updateProduct, productId);
  }

  @Roles(UserType.Admin, UserType.Root, UserType.User)
  @Get('/:productId')
  async findProductById(
    @Param('productId') productId: number,
  ): Promise<ReturnProductDto> {
    return new ReturnProductDto(
      await this.productService.findProductById(productId, true),
    );
  }

  @Get('/:productId/delivery/:cep')
  async findPriceDelivery(
    @Param('productId') productId: number,
    @Param('cep') cep: string,
  ): Promise<ReturnPriceDeliveryDto> {
    return this.productService.findPriceDelivery(cep, productId);
  }
}
