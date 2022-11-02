import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/repositories/base/base.abstract.repository';
import { OrderRepositoryInterface } from './order.interface.repository';
import { Order } from '../../entities/order.entity';

@Injectable()
export class OrderRepository
  extends BaseAbstractRepository<Order>
  implements OrderRepositoryInterface
{
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {
    super(ordersRepository);
  }
}
