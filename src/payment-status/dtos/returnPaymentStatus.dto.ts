import { PaymentStatusEntity } from '../entities/payment-status.entity';

export class ReturnPaymentStatusDto {
  id: number;
  name: string;

  constructor(paymentStatus: PaymentStatusEntity) {
    this.id = paymentStatus.id;
    this.name = paymentStatus.name;
  }
}
