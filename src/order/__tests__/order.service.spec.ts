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
            find: jest.fn().mockResolvedValue(orderMock),
            save: jest.fn().mockResolvedValue(orderMock),
          },
        },
        {
          provide: CartService,
          useValue: {
            findCartByUserId: jest.fn().mockResolvedValue(cartMock),
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
});
