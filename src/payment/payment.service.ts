import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from '../order/dtos/createOrder.dto';
import { PaymentCreditCardEntity } from './entities/payment-credit-card.entity';
import { PaymentType } from '../payment-status/enums/payment-type.enum';
import { PaymentPixEntity } from './entities/payment-pix.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { CartEntity } from '../cart/entities/cart.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  generateFinalPrice(cart: CartEntity, products: ProductEntity[]): number {
    if (!cart.cartProduct || cart.cartProduct.length === 0) {
      return 0;
    }

    return cart.cartProduct.reduce((ac, cartProduct) => {
      const product = products.find(
        (prod) => prod.id === cartProduct.productId,
      );

      if (product) {
        return (ac += cartProduct.amount * product.price);
      }
      return 0;
    }, 0);
  }

  async createPayment(
    createOrder: CreateOrderDto,
    products: ProductEntity[],
    cart: CartEntity,
  ): Promise<PaymentEntity> {
    const finalPrice = this.generateFinalPrice(cart, products);

    if (createOrder.amountPayments) {
      const paymentCreditCard = new PaymentCreditCardEntity(
        PaymentType.Done,
        finalPrice,
        0,
        finalPrice,
        createOrder,
      );

      return this.paymentRepository.save(paymentCreditCard);
    } else if (createOrder.codePix && createOrder.datePayment) {
      const paymentPix = new PaymentPixEntity(
        PaymentType.Done,
        finalPrice,
        0,
        finalPrice,
        createOrder,
      );

      return this.paymentRepository.save(paymentPix);
    }

    throw new BadRequestException(
      'Amount payments, code pix or date payment not found. ',
    );
  }
}
