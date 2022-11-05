import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { EOrderPaymentStatus } from '../enums/order-payment-status.enum';
import { EOrderPaymentType } from '../enums/order-payment-type.enum';
import { Order } from './order.entity';

@Entity()
export class OrderPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  amount: number;

  @Column({
    type: 'enum',
    enum: EOrderPaymentType,
    default: EOrderPaymentType.CASH_ON_DELIVERY,
  })
  type: EOrderPaymentType;

  @Column({
    type: 'enum',
    enum: EOrderPaymentStatus,
    default: EOrderPaymentStatus.AWAITING,
  })
  status: EOrderPaymentStatus;

  @OneToOne(() => Order, (order) => order.payment)
  order: Order;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @Column()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
