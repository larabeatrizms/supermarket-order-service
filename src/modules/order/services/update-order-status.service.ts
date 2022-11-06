import { Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { OrderRepositoryInterface } from '../repositories/order/order.interface.repository';

export class UpdateOrderService {
  private readonly logger = new Logger(UpdateOrderService.name);

  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,
  ) {}

  async execute(data: UpdateOrderStatusDto): Promise<ISuccessResponse | Error> {
    try {
      this.logger.log('Updating a order...');

      this.logger.log('Validating fields...');

      const { id, status } = data;

      const order = await this.orderRepository.findOneById(id);

      if (!order) {
        throw new RpcException('Pedido não encontrado!');
      }

      order.status = status;

      await this.orderRepository.update(order);

      this.logger.log(`Order updated! ID: ${order.id} - Status: ${status}`);

      return {
        success: true,
        message: 'Pedido atualizado!',
        details: {
          order_id: order.id,
          order_status: order.status,
        },
      };
    } catch (error) {
      this.logger.error(error, error.stack);
      throw new RpcException(error?.message || error);
    }
  }
}
