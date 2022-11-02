import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderController } from './controllers/order.controller';

import { CreateOrderService } from './services/create-order.service';

import { OrderRepository } from './repositories/order/order.repository';

import { Order } from './entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [
    CreateOrderService,
    {
      provide: 'OrderRepositoryInterface',
      useClass: OrderRepository,
    },
  ],
  controllers: [OrderController],
  exports: [],
})
export class OrderModule {}
