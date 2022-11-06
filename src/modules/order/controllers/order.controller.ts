import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';
import { CreateOrderService } from '../services/create-order.service';
import { UpdateOrderService } from '../services/update-order-status.service';

@Controller()
export class OrderController {
  constructor(
    private readonly createOrderService: CreateOrderService,
    private readonly updateOrderService: UpdateOrderService,
  ) {}

  @MessagePattern({ role: 'order', cmd: 'create-order' })
  create(data: CreateOrderDto) {
    return this.createOrderService.execute(data);
  }

  @MessagePattern({ role: 'order', cmd: 'update-order-status' })
  update(data: UpdateOrderStatusDto) {
    return this.updateOrderService.execute(data);
  }
}
