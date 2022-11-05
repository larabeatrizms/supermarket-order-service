import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderController } from './controllers/order.controller';

import { CreateOrderService } from './services/create-order.service';

import { Order } from './entities/order.entity';
import { Item } from '../items/entities/item.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderPayment } from './entities/order-payment.entity';
import { OrderShipment } from './entities/order-shipment.entity';

import { OrderRepository } from './repositories/order/order.repository';
import { ItemRepository } from '../items/repositories/item/item.repository';
import { OrderItemRepository } from './repositories/order-item/order-item.repository';
import { OrderPaymentRepository } from './repositories/order-payment/order-payment.repository';
import { OrderShipmentRepository } from './repositories/order-shipment/order-shipment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      OrderPayment,
      OrderShipment,
      Item,
    ]),
  ],
  providers: [
    CreateOrderService,
    {
      provide: 'OrderRepositoryInterface',
      useClass: OrderRepository,
    },
    {
      provide: 'ItemRepositoryInterface',
      useClass: ItemRepository,
    },
    {
      provide: 'OrderPaymentRepositoryInterface',
      useClass: OrderPaymentRepository,
    },
    {
      provide: 'OrderShipmentRepositoryInterface',
      useClass: OrderShipmentRepository,
    },
    {
      provide: 'OrderItemRepositoryInterface',
      useClass: OrderItemRepository,
    },
  ],
  controllers: [OrderController],
  exports: [],
})
export class OrderModule {}
