import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from '../cart.controller';
import { CartService } from '../cart.service';
import { insertCartMock } from '../__mocks__/insertCart.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { ReturnCartDto } from '../dtos/returnCart.dto';
import { cartMock } from '../__mocks__/cart.mock';
import { returnDeleteMock } from '../../__mocks__/returnDelete.mock';
import { productMock } from '../../product/__mocks__/product.mock';
import { updateCartMock } from '../__mocks__/updatCart.mock';

describe('CartController', () => {
  let controller: CartController;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: {
            insertProductInCart: jest
              .fn()
              .mockResolvedValue(new ReturnCartDto(cartMock)),
            findCartByUserId: jest
              .fn()
              .mockResolvedValue(new ReturnCartDto(cartMock)),
            clearCart: jest.fn().mockResolvedValue(returnDeleteMock),
            deleteProductCart: jest.fn().mockResolvedValue(returnDeleteMock),
            updateProductInCart: jest
              .fn()
              .mockResolvedValue(new ReturnCartDto(cartMock)),
          },
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(cartService).toBeDefined();
  });

  it('should return cart entity in insertProductInCart', async () => {
    const cart = await controller.insertCart(insertCartMock, userEntityMock.id);

    expect(cart).toEqual(new ReturnCartDto(cartMock));
  });

  it('should return cart find by user id', async () => {
    const cart = await controller.findCartByUserId(userEntityMock.id);

    expect(cart).toEqual(new ReturnCartDto(cartMock));
  });

  it('should return DeleteResult in clear cart', async () => {
    const deleteResult = await controller.clearCart(userEntityMock.id);

    expect(deleteResult).toEqual(returnDeleteMock);
  });

  it('should return delete product in cart', async () => {
    const deleteResult = await controller.deleteProductCart(
      userEntityMock.id,
      productMock.id,
    );

    expect(deleteResult).toEqual(returnDeleteMock);
  });

  it('should return cart after update', async () => {
    const updatedCart = await controller.updateProductInCart(
      updateCartMock,
      userEntityMock.id,
    );

    expect(updatedCart).toEqual(new ReturnCartDto(cartMock));
  });
});
