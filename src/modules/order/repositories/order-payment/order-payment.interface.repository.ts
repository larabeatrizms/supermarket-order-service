import { BaseInterfaceRepository } from '../../../../repositories/base/base.interface.repository';
import { OrderPayment } from '../../entities/order-payment.entity';

export type OrderPaymentRepositoryInterface =
  BaseInterfaceRepository<OrderPayment>;
