import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../order.service';
import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartService } from '../../cart/cart.service';
import { PaymentService } from '../../payment/payment.service';
import { ProductService } from '../../product/product.service';
import { OrderProductService } from '../../order-product/order-product.service';
import { cartMock } from '../../cart/__mocks__/cart.mock';
import { returnDeleteMock } from '../../__mocks__/returnDelete.mock';
import { productMock } from '../../product/__mocks__/product.mock';
import { orderMock } from '../__mocks__/order.mock';
import { paymentMock } from '../../payment/__mocks__/payment.mock';
import { orderProductMock } from '../../order-product/__mocks__/orderProduct.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { cartProductMock } from '../../cart-product/__mocks__/cart-product.mock';
import { createOrderPixMock } from '../__mocks__/createOrder.mock';

jest.useFakeTimers().setSystemTime(new Date('2023-07-13'));

describe('OrderService', () => {
  let service: OrderService;
  let cartService: CartService;
  let paymentService: PaymentService;
  let productService: ProductService;
  let orderProductService: OrderProductService;

  let orderRepository: Repository<OrderEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([orderMock]),
            save: jest.fn().mockResolvedValue(orderMock),
          },
        },
        {
          provide: CartService,
          useValue: {
            findCartByUserId: jest.fn().mockResolvedValue({
              ...cartMock,
              cartProduct: [cartProductMock],
            }),
            clearCart: jest.fn().mockResolvedValue(returnDeleteMock),
          },
        },
        {
          provide: PaymentService,
          useValue: {
            createPayment: jest.fn().mockResolvedValue(paymentMock),
          },
        },
        {
          provide: ProductService,
          useValue: {
            findAllProducts: jest.fn().mockResolvedValue([productMock]),
          },
        },
        {
          provide: OrderProductService,
          useValue: {
            createOrderProduct: jest.fn().mockResolvedValue(orderProductMock),
            findAmountProductsByOrderId: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    cartService = module.get<CartService>(CartService);
    paymentService = module.get<PaymentService>(PaymentService);
    productService = module.get<ProductService>(ProductService);
    orderProductService = module.get<OrderProductService>(OrderProductService);
    orderRepository = module.get<Repository<OrderEntity>>(
      getRepositoryToken(OrderEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cartService).toBeDefined();
    expect(paymentService).toBeDefined();
    expect(productService).toBeDefined();
    expect(orderProductService).toBeDefined();
    expect(orderRepository).toBeDefined();
  });

  it('should return order by user id', async () => {
    const orders = await service.findOrdersByUserId(userEntityMock.id);

    expect(orders).toEqual([orderMock]);
  });

  it('should return NotFoundException in find orders by user id empty', async () => {
    jest.spyOn(orderRepository, 'find').mockResolvedValue([]);

    expect(service.findOrdersByUserId(userEntityMock.id)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should call createOrderProduct amount cartProduct in cart', async () => {
    const spyOrderProduct = jest.spyOn(
      orderProductService,
      'createOrderProduct',
    );

    const createOrderProductUsingCart =
      await service.createOrderProductUsingCart(
        { ...cartMock, cartProduct: [cartProductMock, cartProductMock] },
        orderMock.id,
        [productMock],
      );

    expect(createOrderProductUsingCart).toEqual([
      orderProductMock,
      orderProductMock,
    ]);
    expect(spyOrderProduct.mock.calls.length).toEqual(2);
  });

  it('should return order in save', async () => {
    const spy = jest.spyOn(orderRepository, 'save');

    const order = await service.saveOrder(
      createOrderPixMock,
      userEntityMock.id,
      paymentMock,
    );

    expect(order).toEqual(orderMock);
    expect(spy.mock.calls[0][0]).toEqual({
      addressId: createOrderPixMock.addressId,
      date: new Date(),
      userId: userEntityMock.id,
      paymentId: paymentMock.id,
    });
  });

  it('should return exception in error save', async () => {
    jest.spyOn(orderRepository, 'save').mockRejectedValue(new Error());
    expect(
      service.saveOrder(createOrderPixMock, userEntityMock.id, paymentMock),
    ).rejects.toThrowError();
  });

  it('should return order in create order success', async () => {
    const spyCartService = jest.spyOn(cartService, 'findCartByUserId');
    const spyClearCart = jest.spyOn(cartService, 'clearCart');
    const spyProductService = jest.spyOn(productService, 'findAllProducts');
    const spyPaymentService = jest.spyOn(paymentService, 'createPayment');
    const spyCreateOrder = jest.spyOn(
      orderProductService,
      'createOrderProduct',
    );
    const spySave = jest.spyOn(orderRepository, 'save');

    const order = await service.createOrder(
      createOrderPixMock,
      userEntityMock.id,
    );

    expect(order).toEqual(orderMock);
    expect(spyCartService.mock.calls.length).toEqual(1);
    expect(spyProductService.mock.calls.length).toEqual(1);
    expect(spyPaymentService.mock.calls.length).toEqual(1);
    expect(spyClearCart.mock.calls.length).toEqual(1);
    expect(spyCreateOrder.mock.calls.length).toEqual(1);
    expect(spySave.mock.calls.length).toEqual(1);
  });

  it('should return all orders', async () => {
    const spy = jest.spyOn(orderRepository, 'find');

    const orders = await service.findAllOrders();

    expect(orders).toEqual([orderMock]);
    expect(spy.mock.calls[0][0]).toEqual({
      relations: {
        user: true,
      },
    });
  });

  it('should return error in exception orders not found', async () => {
    jest.spyOn(orderRepository, 'find').mockResolvedValue([]);

    expect(service.findAllOrders()).rejects.toThrowError(NotFoundException);
  });
});
