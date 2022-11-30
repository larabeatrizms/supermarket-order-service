import { IUserSession } from 'src/shared/interfaces/user-session.interface';
import { EOrderStatusCode } from '../enums/order-status-code.enum';

export interface UpdateOrderStatusDto {
  id: number;
  status: EOrderStatusCode;
  userSession: IUserSession;
}
