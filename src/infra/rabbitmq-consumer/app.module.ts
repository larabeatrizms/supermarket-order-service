import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from '../../modules/order/entities/order.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

import { ItemModule } from 'src/modules/items/item.module';
import { CustomerModule } from 'src/modules/customers/customer.module';

import { Item } from 'src/modules/items/entities/item.entity';
import { OrderItem } from 'src/modules/order/entities/order-item.entity';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { OrderPayment } from 'src/modules/order/entities/order-payment.entity';
import { OrderShipment } from 'src/modules/order/entities/order-shipment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ItemModule,
    CustomerModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: `amqp://${configService.get('RABBIT_HOST')}`,
        exchanges: [
          {
            name: 'event.exchange',
            type: 'topic',
          },
        ],
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          Order,
          Item,
          OrderItem,
          OrderPayment,
          OrderShipment,
          Customer,
        ],
        synchronize: true,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
