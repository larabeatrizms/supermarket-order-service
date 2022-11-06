import { EOrderStatusCode } from '../enums/order-status-code.enum';

export interface UpdateOrderStatusDto {
  id: number;
  status: EOrderStatusCode;
}
