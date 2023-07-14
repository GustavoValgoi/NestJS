import { PaymentEntity } from '../entities/payment.entity';
import { ReturnPaymentStatusDto } from '../../payment-status/dtos/returnPaymentStatus.dto';

export class ReturnPaymentDto {
  id: number;
  statusId: number;
  price: number;
  discount: number;
  finalPrice: number;
  type: string;
  paymentStatus?: ReturnPaymentStatusDto;

  constructor(payment: PaymentEntity) {
    this.id = payment.id;
    this.statusId = payment.statusId;
    this.price = payment.price;
    this.discount = payment.discount;
    this.finalPrice = payment.finalPrice;
    this.type = payment.type;
    this.paymentStatus = payment.paymentStatus
      ? new ReturnPaymentStatusDto(payment.paymentStatus)
      : undefined;
  }
}
