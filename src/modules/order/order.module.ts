import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

import { OrderController } from './controllers/order.controller';

import { CreateOrderService } from './services/create-order.service';

import { OrderRepository } from './repositories/order/order.repository';

import { Order } from './entities/order.entity';

import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    // RabbitMQModule.forRootAsync(RabbitMQModule, {
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     uri: `amqp://${configService.get('RABBIT_HOST')}`,
    //     exchanges: [
    //       {
    //         name: 'event.exchange',
    //         type: 'topic',
    //       },
    //     ],
    //   }),
    // }),
  ],
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
