import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../payment.service';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paymentMock } from '../__mocks__/payment.mock';
import {
  createOrderCreditCardMock,
  createOrderPixMock,
} from '../../order/__mocks__/createOrder.mock';
import { productMock } from '../../product/__mocks__/product.mock';
import { cartMock } from '../../cart/__mocks__/cart.mock';
import { paymentCreditCardMock } from '../__mocks__/paymentCreditCard.mock';
import { paymentPixMock } from '../__mocks__/paymentPix.mock';
import { PaymentPixEntity } from '../entities/payment-pix.entity';
import { PaymentCreditCardEntity } from '../entities/payment-credit-card.entity';
import { BadRequestException } from '@nestjs/common';
import { addressMock } from '../../address/__mocks__/address.mock';
import { cartProductMock } from '../../cart-product/__mocks__/cart-product.mock';
import { PaymentType } from '../../payment-status/enums/payment-type.enum';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepository: Repository<PaymentEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(PaymentEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([paymentMock]),
            save: jest.fn().mockResolvedValue(paymentMock),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    paymentRepository = module.get<Repository<PaymentEntity>>(
      getRepositoryToken(PaymentEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(paymentRepository).toBeDefined();
  });

  it('should return payment Pix after save in database', async () => {
    const spy = jest.spyOn(paymentRepository, 'save');
    const payment = await service.createPayment(
      createOrderPixMock,
      [productMock],
      cartMock,
    );
    const savePayment = spy.mock.calls[0][0] as PaymentPixEntity;
    expect(payment).toEqual(paymentMock);
    expect(savePayment.code).toEqual(paymentPixMock.code);
  });

  it('should return payment Credit Card after save in database', async () => {
    const spy = jest.spyOn(paymentRepository, 'save');
    const payment = await service.createPayment(
      createOrderCreditCardMock,
      [productMock],
      cartMock,
    );
    const savePayment = spy.mock.calls[0][0] as PaymentCreditCardEntity;

    expect(payment).toEqual(paymentMock);
    expect(savePayment.amountPayments).toEqual(
      paymentCreditCardMock.amountPayments,
    );
  });

  it('should return error in exception in payment', async () => {
    expect(
      service.createPayment(
        { addressId: addressMock.id },
        [productMock],
        cartMock,
      ),
    ).rejects.toThrowError(BadRequestException);
  });

  it('should return final price 0 in cartProduct undefined', async () => {
    const spy = jest.spyOn(paymentRepository, 'save');

    await service.createPayment(
      createOrderCreditCardMock,
      [productMock],
      cartMock,
    );

    const savePayment = spy.mock.calls[0][0] as PaymentCreditCardEntity;
    expect(savePayment.finalPrice).toEqual(0);
  });

  it('should return final price 500 in cartProduct send', async () => {
    const spy = jest.spyOn(paymentRepository, 'save');
    await service.createPayment(createOrderCreditCardMock, [productMock], {
      ...cartMock,
      cartProduct: [cartProductMock],
    });
    const savePayment = spy.mock.calls[0][0] as PaymentCreditCardEntity;

    expect(savePayment.finalPrice).toEqual(500);
  });

  it('should return all data in save payment', async () => {
    const spy = jest.spyOn(paymentRepository, 'save');
    await service.createPayment(createOrderCreditCardMock, [productMock], {
      ...cartMock,
      cartProduct: [cartProductMock],
    });
    const savePayment = spy.mock.calls[0][0] as PaymentCreditCardEntity;

    const paymentCreditCart: PaymentCreditCardEntity =
      new PaymentCreditCardEntity(
        PaymentType.Done,
        500,
        0,
        500,
        createOrderCreditCardMock,
      );

    expect(savePayment).toEqual(paymentCreditCart);
  });
});
