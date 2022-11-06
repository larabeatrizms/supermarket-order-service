import { BadRequestException, Inject, Logger } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { OrderRepositoryInterface } from '../repositories/order/order.interface.repository';

export class FindOrderByIdService {
  private readonly logger = new Logger(FindOrderByIdService.name);

  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,
  ) {}

  async execute(id: number): Promise<Order | Error> {
    this.logger.log(`Searching order... id: ${id}`);

    const order = await this.orderRepository.findOneWithRelations({
      where: {
        id,
      },
      relations: {
        customer: true,
        payment: true,
        shipment: true,
        items: true,
      },
    });

    if (!order) {
      this.logger.log('Order not found.');

      return new BadRequestException('Pedido não encontrado!');
    }

    this.logger.log('Order founded.');

    return order;
  }
}
