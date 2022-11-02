import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { CreateOrderDto } from '../dtos/create-order.dto';
import { CreateOrderService } from '../services/create-order.service';

@Controller()
export class OrderController {
  constructor(private readonly createOrderService: CreateOrderService) {}

  @MessagePattern({ role: 'order', cmd: 'create-order' })
  create(data: CreateOrderDto) {
    return this.createOrderService.execute(data);
  }
}
