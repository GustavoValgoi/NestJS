import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { ProductEntity } from './entities/product.entity';
import { ReturnProductDto } from './dtos/returnProduct.dto';

@Roles(UserType.Admin, UserType.Admin)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAllProducts(): Promise<ReturnProductDto[]> {
    return (await this.productService.findAllProducts()).map(
      (product: ProductEntity) => new ReturnProductDto(product),
    );
  }
}
