import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderProductService } from '../order-product.service';
import { OrderProductEntity } from '../entities/order-product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { orderProductMock } from '../__mocks__/orderProduct.mock';

describe('OrderProductService', () => {
  let service: OrderProductService;
  let orderProductRepository: Repository<OrderProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderProductService,
        {
          provide: getRepositoryToken(OrderProductEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(orderProductMock),
          },
        },
      ],
    }).compile();

    service = module.get<OrderProductService>(OrderProductService);
    orderProductRepository = module.get<Repository<OrderProductEntity>>(
      getRepositoryToken(OrderProductEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(orderProductRepository).toBeDefined();
  });
});
