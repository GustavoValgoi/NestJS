import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentStatusEntity } from './entities/payment-status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentStatusService {
  constructor(
    @InjectRepository(PaymentStatusEntity)
    private readonly paymentStatusRepository: Repository<PaymentStatusEntity>,
  ) {}
}
