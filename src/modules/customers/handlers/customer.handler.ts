import { ackErrorHandler, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { ICreateCustomerPayload } from '../interfaces/create-user-payload.interface';
import { IDeleteCustomerPayload } from '../interfaces/delete-user-payload.interface';
import { IUpdateCustomerPayload } from '../interfaces/update-user-payload.interface';

import { CreateCustomerService } from '../services/create-customer.service';
import { DeleteCustomerService } from '../services/delete-customer.service';
import { UpdateCustomerService } from '../services/update-customer.service';

@Injectable()
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);

  constructor(
    private readonly createCustomerService: CreateCustomerService,
    private readonly updateCustomerService: UpdateCustomerService,
    private readonly deleteCustomerService: DeleteCustomerService,
  ) {}

  @RabbitSubscribe({
    exchange: 'event.exchange',
    routingKey: 'event.create.user.#',
    queue: 'event.create.user.to.order',
    createQueueIfNotExists: true,
    errorHandler: ackErrorHandler,
  })
  async createUserHandler(payload: ICreateCustomerPayload) {
    this.logger.log(
      `Message received! event.create.user.to.order - UserID: ${payload.id}`,
    );

    const { firstName, lastName, id, email } = payload;

    await this.createCustomerService.execute({
      email,
      name: firstName + ' ' + lastName,
      integration_id: id,
    });

    this.logger.log(
      `Message handler finished! event.create.user.to.order - UserID: ${payload.id}`,
    );
  }

  @RabbitSubscribe({
    exchange: 'event.exchange',
    routingKey: 'event.update.user.#',
    queue: 'event.update.user.to.order',
    createQueueIfNotExists: true,
    errorHandler: ackErrorHandler,
  })
  async updateUserHandler(payload: IUpdateCustomerPayload) {
    this.logger.log(
      `Message received! event.update.user.to.order - UserID: ${payload.id}`,
    );

    const { firstName, lastName, id, email } = payload;

    await this.updateCustomerService.execute({
      email,
      name: firstName + ' ' + lastName,
      integration_id: id,
    });

    this.logger.log(
      `Message handler finished! event.update.user.to.order - UserID: ${payload.id}`,
    );
  }

  @RabbitSubscribe({
    exchange: 'event.exchange',
    routingKey: 'event.delete.user.#',
    queue: 'event.delete.user.to.order',
    createQueueIfNotExists: true,
    errorHandler: ackErrorHandler,
  })
  async deleteUserHandler(payload: IDeleteCustomerPayload) {
    this.logger.log(
      `Message received! event.delete.user.to.order - UserID: ${payload.id}`,
    );

    const { id } = payload;

    await this.deleteCustomerService.execute(id);

    this.logger.log(
      `Message handler finished! event.delete.user.to.order - UserID: ${payload.id}`,
    );
  }
}
