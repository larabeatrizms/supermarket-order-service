import { EOrderPaymentType } from '../enums/order-payment-type.enum';

export interface CreateOrderShipmentDto {
  to_address: string;
  zipcode: string;
}
export interface CreateOrderPaymentDto {
  type: EOrderPaymentType;
}

export interface CreateOrderItemDto {
  name: string;
  product_id: number;
  quantity: number;
  price: number;
}

export interface CreateOrderDto {
  customer_id: number;
  shipment: CreateOrderShipmentDto;
  payment: CreateOrderPaymentDto;
  items: CreateOrderItemDto[];
}
