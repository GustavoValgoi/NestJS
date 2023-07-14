import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';
import { orderMock } from '../__mocks__/order.mock';
import { createOrderCreditCardMock } from '../__mocks__/createOrder.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { ReturnOrderDto } from '../dtos/returnOrder.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn().mockResolvedValue(orderMock),
            findOrdersByUserId: jest.fn().mockResolvedValue([orderMock]),
            findAllOrders: jest
              .fn()
              .mockResolvedValue([new ReturnOrderDto(orderMock)]),
          },
        },
      ],
      controllers: [OrderController],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(orderService).toBeDefined();
  });

  it('should return order create with success', async () => {
    const order = await controller.createOrder(
      createOrderCreditCardMock,
      userEntityMock.id,
    );
    expect(order).toEqual(orderMock);
  });

  it('should return all orders by userId', async () => {
    const spy = jest.spyOn(orderService, 'findOrdersByUserId');
    const orders = await controller.findOrdersByUserId(userEntityMock.id);
    expect(orders).toEqual([orderMock]);
    expect(spy.mock.calls.length).toEqual(1);
  });

  it('should return all orders', async () => {
    const spy = jest.spyOn(orderService, 'findAllOrders');
    const orders = await controller.findAllOrders();
    expect(orders).toEqual([new ReturnOrderDto(orderMock)]);
    expect(spy.mock.calls.length).toEqual(1);
  });

  it('should return order by order id', async () => {
    const spy = jest.spyOn(orderService, 'findOrdersByUserId');
    const order = await controller.findOrderByOrderId(orderMock.id);
    expect(order).toEqual(new ReturnOrderDto(orderMock));
    expect(spy.mock.calls.length).toEqual(1);
  });
});
