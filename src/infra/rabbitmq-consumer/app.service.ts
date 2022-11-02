import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  @RabbitSubscribe({
    exchange: 'event.exchange',
    routingKey: 'event.create.product.#',
    queue: 'event.create.product.to.order',
    createQueueIfNotExists: true,
  })
  createProductHandler(payload: any) {
    console.log(payload);
    console.log('Message received! event.create.product.to.order');
  }
}
