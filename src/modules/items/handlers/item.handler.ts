import { ackErrorHandler, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';

import { ICreateProductPayload } from '../interfaces/create-product-payload.interface';
import { CreateItemService } from '../services/create-item.service';

@Injectable()
export class ItemController {
  private readonly logger = new Logger(ItemController.name);

  constructor(private readonly createItemService: CreateItemService) {}

  @RabbitSubscribe({
    exchange: 'event.exchange',
    routingKey: 'event.create.product.#',
    queue: 'event.create.product.to.order',
    createQueueIfNotExists: true,
    errorHandler: ackErrorHandler,
  })
  async createProductHandler(payload: ICreateProductPayload) {
    this.logger.log(
      `Message received! event.create.product.to.order - ProductID: ${payload.id}`,
    );

    const { name, price, image, id } = payload;

    await this.createItemService.execute({
      image,
      name,
      integration_id: id,
      price,
    });

    this.logger.log(
      `Message handler finished! event.create.product.to.order - ProductID: ${payload.id}`,
    );
  }
}
