import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  @MessagePattern({ role: 'order', cmd: 'ping' })
  ping() {
    return {
      test: 'Hello Order!',
    };
  }
}
