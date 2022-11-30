import { Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { OrderRepositoryInterface } from '../repositories/order/order.interface.repository';
import { EOrderStatusCode } from '../enums/order-status-code.enum';

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

      const { id, status, userSession } = data;

      const order = await this.orderRepository.findOneWithRelations({
        where: {
          id,
        },
        relations: {
          customer: true,
        },
      });

      if (!order) {
        throw new RpcException('Pedido não encontrado!');
      }

      if (
        userSession.role === 'customer' &&
        order.customer.integration_id !== userSession.userId
      ) {
        throw new RpcException('Usuário sem permissão de realizar esta ação.');
      }

      if (
        userSession.role === 'customer' &&
        status !== EOrderStatusCode.CANCELLED
      ) {
        throw new RpcException(
          'Usuário com permissão apenas de cancelar pedido.',
        );
      }

      const canCacelled = [
        EOrderStatusCode.PLACED,
        EOrderStatusCode.CONFIRMED,
        EOrderStatusCode.PREPARATION_STARTED,
      ];

      if (
        userSession.role === 'customer' &&
        !canCacelled.includes(order.status)
      ) {
        throw new RpcException('Não é possível cancelar o pedido nesta etapa.');
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
