export interface IOrderItem {
  id: number;
  order_id: number;
  item_id: number;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
