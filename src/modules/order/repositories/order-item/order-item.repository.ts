import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/repositories/base/base.abstract.repository';
import { OrderItemRepositoryInterface } from './order-item.interface.repository';
import { OrderItem } from '../../entities/order-item.entity';

@Injectable()
export class OrderItemRepository
  extends BaseAbstractRepository<OrderItem>
  implements OrderItemRepositoryInterface
{
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
  ) {
    super(orderItemsRepository);
  }
}
