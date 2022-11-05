import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/repositories/base/base.abstract.repository';
import { OrderPayment } from '../../entities/order-payment.entity';
import { OrderPaymentRepositoryInterface } from './order-payment.interface.repository';

@Injectable()
export class OrderPaymentRepository
  extends BaseAbstractRepository<OrderPayment>
  implements OrderPaymentRepositoryInterface
{
  constructor(
    @InjectRepository(OrderPayment)
    private readonly orderPaymentsRepository: Repository<OrderPayment>,
  ) {
    super(orderPaymentsRepository);
  }
}
