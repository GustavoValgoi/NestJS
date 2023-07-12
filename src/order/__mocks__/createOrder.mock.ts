import { paymentPixMock } from '../../payment/__mocks__/paymentPix.mock';
import { addressMock } from '../../address/__mocks__/address.mock';
import { CreateOrderDto } from '../dtos/createOrder.dto';
import { paymentCreditCardMock } from '../../payment/__mocks__/paymentCreditCard.mock';

export const createOrderPixMock: CreateOrderDto = {
  addressId: addressMock.id,
  codePix: paymentPixMock.code,
  datePayment: paymentPixMock.datePayment,
};

export const createOrderCreditCardMock: CreateOrderDto = {
  addressId: addressMock.id,
  amountPayments: paymentCreditCardMock.amountPayments,
};
