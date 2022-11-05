import { EOrderStatusCode } from '../enums/order-status-code.enum';

export interface IOrder {
  id: number;
  customer_id: number;
  status: EOrderStatusCode;
  shipment_id: number;
  payment_id: number;
  createdAt: Date;
  updatedAt: Date;
}
