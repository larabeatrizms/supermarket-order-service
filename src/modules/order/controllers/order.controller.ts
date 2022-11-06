import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { CreateOrderDto } from '../dtos/create-order.dto';
import { FindOrderByIdDto } from '../dtos/find-order-by-id.dto';
import { FindOrdersByFieldsDto } from '../dtos/find-orders-by-fields.dto';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';
import { CreateOrderService } from '../services/create-order.service';
import { FindOrdersByFieldsService } from '../services/find-order-by-fields.service';
import { FindOrderByIdService } from '../services/find-order-by-id.service';
import { UpdateOrderService } from '../services/update-order-status.service';

@Controller()
export class OrderController {
  constructor(
    private readonly createOrderService: CreateOrderService,
    private readonly updateOrderService: UpdateOrderService,
    private readonly findOrderByIdService: FindOrderByIdService,
    private readonly findOrdersByFieldsService: FindOrdersByFieldsService,
  ) {}

  @MessagePattern({ role: 'order', cmd: 'create-order' })
  create(data: CreateOrderDto) {
    return this.createOrderService.execute(data);
  }

  @MessagePattern({ role: 'order', cmd: 'update-order-status' })
  update(data: UpdateOrderStatusDto) {
    return this.updateOrderService.execute(data);
  }

  @MessagePattern({ role: 'order', cmd: 'find-order-by-id' })
  findById(data: FindOrderByIdDto) {
    return this.findOrderByIdService.execute(data.id);
  }

  @MessagePattern({ role: 'order', cmd: 'find-orders-by-fields' })
  findOrdersByFields(data: FindOrdersByFieldsDto) {
    return this.findOrdersByFieldsService.execute(data);
  }
}
