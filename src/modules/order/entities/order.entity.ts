import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { EOrderStatusCode } from '../enums/order-status-code.enum';
import { IOrder } from '../interfaces/order.interface';
import { OrderItem } from './order-item.entity';
import { OrderPayment } from './order-payment.entity';
import { OrderShipment } from './order-shipment.entity';

@Entity()
export class Order implements IOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customer_id: number;

  @Column({
    type: 'enum',
    enum: EOrderStatusCode,
    default: EOrderStatusCode.PLACED,
  })
  status: EOrderStatusCode;

  @Column()
  shipment_id: number;

  @Column()
  payment_id: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];

  @OneToOne(() => OrderShipment, (orderShipment) => orderShipment.order)
  @JoinColumn({ name: 'shipment_id' })
  shipment: OrderShipment;

  @OneToOne(() => OrderPayment, (orderPayment) => orderPayment.order)
  @JoinColumn({ name: 'payment_id' })
  payment: OrderPayment;

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
