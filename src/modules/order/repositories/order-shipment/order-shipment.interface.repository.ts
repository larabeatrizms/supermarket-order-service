import { BaseInterfaceRepository } from '../../../../repositories/base/base.interface.repository';
import { OrderShipment } from '../../entities/order-shipment.entity';

export type OrderShipmentRepositoryInterface =
  BaseInterfaceRepository<OrderShipment>;
