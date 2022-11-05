import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';

import { OrderModule } from '../../modules/order/order.module';

import { Order } from '../../modules/order/entities/order.entity';
import { Item } from 'src/modules/items/entities/item.entity';
import { OrderItem } from 'src/modules/order/entities/order-item.entity';
import { OrderPayment } from 'src/modules/order/entities/order-payment.entity';
import { OrderShipment } from 'src/modules/order/entities/order-shipment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OrderModule,
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
        entities: [Order, Item, OrderItem, OrderPayment, OrderShipment],
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
