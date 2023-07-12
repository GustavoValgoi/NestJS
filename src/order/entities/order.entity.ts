import { OrderProductEntity } from '../../order-product/entities/order-product.entity';
import { AddressEntity } from '../../address/entities/address.entity';
import { PaymentEntity } from '../../payment/entities/payment.entity';
import { UserEntity } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'order' })
export class OrderEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'address_id', nullable: false })
  addressId: number;

  @Column({ name: 'payment_id', nullable: false })
  paymentId: number;

  @Column({ name: 'date', nullable: false })
  date: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.orders)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: UserEntity;

  @ManyToOne(() => AddressEntity, (address: AddressEntity) => address.orders)
  @JoinColumn({ name: 'address_id', referencedColumnName: 'id' })
  address?: AddressEntity;

  @ManyToOne(() => PaymentEntity, (payment: PaymentEntity) => payment.orders)
  @JoinColumn({ name: 'payment_id', referencedColumnName: 'id' })
  payment?: PaymentEntity;

  @OneToMany(
    () => OrderProductEntity,
    (orderProduct: OrderProductEntity) => orderProduct.order,
  )
  ordersProduct?: OrderProductEntity[];
}
