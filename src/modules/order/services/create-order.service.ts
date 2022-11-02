import { Inject, Logger } from '@nestjs/common';

import { CreateOrderDto } from '../dtos/create-order.dto';
import { RpcException } from '@nestjs/microservices';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { OrderRepositoryInterface } from '../repositories/order/order.interface.repository';

export class CreateOrderService {
  private readonly logger = new Logger(CreateOrderService.name);

  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,
  ) {}

  async execute(data: CreateOrderDto): Promise<ISuccessResponse | Error> {
    try {
      this.logger.log('Creating a order...');

      this.logger.log('Validating fields...');

      const { customer_id } = data;

      // const category = await this.categoryRepository.findOneById(
      //   data.category_id,
      // );

      // if (!category) {
      //   throw new RpcException('Categoria não encontrada!');
      // }

      const order = await this.orderRepository.create({
        customer_id,
        payment_id: 1,
        shipment_id: 1,
        status_code_id: 1,
      });

      this.logger.log(`Order created! ID: ${order.id}`);

      return {
        success: true,
        message: 'Pedido Criado!',
        details: {
          order_id: order.id,
        },
      };
    } catch (error) {
      this.logger.error(error, error.stack);
      throw new RpcException(error?.message || error);
    }
  }
}
