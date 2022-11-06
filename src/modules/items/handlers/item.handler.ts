import { ackErrorHandler, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';

import { ICreateProductPayload } from '../interfaces/create-product-payload.interface';
import { IDeleteProductPayload } from '../interfaces/delete-product-payload.interface';
import { IUpdateProductPayload } from '../interfaces/update-product-payload.interface';
import { CreateItemService } from '../services/create-item.service';
import { DeleteItemService } from '../services/delete-item.service';
import { UpdateItemService } from '../services/update-item.service';

@Injectable()
export class ItemController {
  private readonly logger = new Logger(ItemController.name);

  constructor(
    private readonly createItemService: CreateItemService,
    private readonly updateItemService: UpdateItemService,
    private readonly deleteItemService: DeleteItemService,
  ) {}

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

  @RabbitSubscribe({
    exchange: 'event.exchange',
    routingKey: 'event.update.product.#',
    queue: 'event.update.product.to.order',
    createQueueIfNotExists: true,
    errorHandler: ackErrorHandler,
  })
  async updateProductHandler(payload: IUpdateProductPayload) {
    this.logger.log(
      `Message received! event.update.product.to.order - ProductID: ${payload.id}`,
    );

    const { name, price, image, id } = payload;

    await this.updateItemService.execute({
      image,
      name,
      integration_id: id,
      price,
    });

    this.logger.log(
      `Message handler finished! event.update.product.to.order - ProductID: ${payload.id}`,
    );
  }

  @RabbitSubscribe({
    exchange: 'event.exchange',
    routingKey: 'event.delete.product.#',
    queue: 'event.delete.product.to.order',
    createQueueIfNotExists: true,
    errorHandler: ackErrorHandler,
  })
  async deleteProductHandler(payload: IDeleteProductPayload) {
    this.logger.log(
      `Message received! event.delete.product.to.order - ProductID: ${payload.id}`,
    );

    const { id } = payload;

    await this.deleteItemService.execute(id);

    this.logger.log(
      `Message handler finished! event.delete.product.to.order - ProductID: ${payload.id}`,
    );
  }
}
