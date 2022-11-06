import { BadRequestException, Inject, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CustomerRepositoryInterface } from 'src/modules/customers/repositories/customer/customer.interface.repository';
import { FindOrdersByFieldsDto } from '../dtos/find-orders-by-fields.dto';
import { Order } from '../entities/order.entity';
import { OrderRepositoryInterface } from '../repositories/order/order.interface.repository';

export class FindOrdersByFieldsService {
  private readonly logger = new Logger(FindOrdersByFieldsService.name);

  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,
    @Inject('CustomerRepositoryInterface')
    private readonly customerRepository: CustomerRepositoryInterface,
  ) {}

  async execute(data: FindOrdersByFieldsDto): Promise<Order[] | Error> {
    this.logger.log(`Searching orders...`);

    const { user_id } = data;

    const whereQuery = {
      customer_id: null,
    };

    if (user_id) {
      const customer = await this.customerRepository.findOneByCondition({
        integration_id: user_id,
      });

      if (!customer) {
        throw new RpcException(`Cliente não encontrado!`);
      }

      whereQuery.customer_id = customer.id;
    }

    const orders = await this.orderRepository.findWithRelations({
      where: whereQuery,
    });

    if (!orders || !orders.length) {
      this.logger.log('Orders not found.');

      return new BadRequestException('Pedidos não encontrados!');
    }

    this.logger.log('Orders found.');

    return orders;
  }
}
