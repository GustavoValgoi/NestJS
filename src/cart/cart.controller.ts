import {
  Controller,
  Post,
  Get,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { InsertCartDto } from './dtos/insertCart.dto';
import { UserId } from '../decorators/userId.decorator';
import { ReturnCartDto } from './dtos/returnCart.dto';

@Roles(UserType.User, UserType.Admin)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async insertCart(
    @Body() insertCart: InsertCartDto,
    @UserId() userId: number,
  ): Promise<ReturnCartDto> {
    return new ReturnCartDto(
      await this.cartService.insertProductInCart(insertCart, userId),
    );
  }

  @Get()
  async findCartByUserId(@UserId() userId: number): Promise<ReturnCartDto> {
    return new ReturnCartDto(
      await this.cartService.findCartByUserId(userId, true),
    );
  }
}
