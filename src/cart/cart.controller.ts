import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  UsePipes,
  ValidationPipe,
  Body,
  Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { InsertCartDto } from './dtos/insertCart.dto';
import { UserId } from '../decorators/userId.decorator';
import { ReturnCartDto } from './dtos/returnCart.dto';
import { DeleteResult } from 'typeorm';
import { UpdateCartDto } from './dtos/updateCart.dto';

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

  @Delete()
  async clearCart(@UserId() userId: number): Promise<DeleteResult> {
    return this.cartService.clearCart(userId);
  }

  @Delete('/product/:productId')
  async deleteProductCart(
    @UserId() userId: number,
    @Param('productId') productId: number,
  ): Promise<DeleteResult> {
    return this.cartService.deleteProductCart(userId, productId);
  }

  @UsePipes(ValidationPipe)
  @Patch()
  async updateProductInCart(
    @Body() updateCart: UpdateCartDto,
    @UserId() userId: number,
  ): Promise<ReturnCartDto> {
    return new ReturnCartDto(
      await this.cartService.updateProductInCart(updateCart, userId),
    );
  }
}
