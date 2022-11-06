import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderController } from './controllers/order.controller';

import { CreateOrderService } from './services/create-order.service';
import { UpdateOrderService } from './services/update-order-status.service';

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
import { CustomerRepository } from '../customers/repositories/customer/customer.repository';
import { Customer } from '../customers/entities/customer.entity';
import { FindOrderByIdService } from './services/find-order-by-id.service';
import { FindOrdersByFieldsService } from './services/find-order-by-fields.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      OrderPayment,
      OrderShipment,
      Item,
      Customer,
    ]),
  ],
  providers: [
    CreateOrderService,
    UpdateOrderService,
    FindOrderByIdService,
    FindOrdersByFieldsService,
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
    {
      provide: 'CustomerRepositoryInterface',
      useClass: CustomerRepository,
    },
  ],
  controllers: [OrderController],
  exports: [],
})
export class OrderModule {}
