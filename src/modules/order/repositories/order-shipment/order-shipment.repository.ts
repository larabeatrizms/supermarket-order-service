import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/repositories/base/base.abstract.repository';
import { OrderShipment } from '../../entities/order-shipment.entity';
import { OrderShipmentRepositoryInterface } from './order-shipment.interface.repository';

@Injectable()
export class OrderShipmentRepository
  extends BaseAbstractRepository<OrderShipment>
  implements OrderShipmentRepositoryInterface
{
  constructor(
    @InjectRepository(OrderShipment)
    private readonly orderShipmentsRepository: Repository<OrderShipment>,
  ) {
    super(orderShipmentsRepository);
  }
}
