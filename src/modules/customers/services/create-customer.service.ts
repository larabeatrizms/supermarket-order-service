import { Inject, Logger } from '@nestjs/common';

import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { RpcException } from '@nestjs/microservices';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { CustomerRepositoryInterface } from '../repositories/customer/customer.interface.repository';

export class CreateCustomerService {
  private readonly logger = new Logger(CreateCustomerService.name);

  constructor(
    @Inject('CustomerRepositoryInterface')
    private readonly customerRepository: CustomerRepositoryInterface,
  ) {}

  async execute(data: CreateCustomerDto): Promise<ISuccessResponse | Error> {
    try {
      this.logger.log('Creating a customer...');

      this.logger.log('Validating fields...');

      const { integration_id, name, email } = data;

      const customerAlreadyCreated =
        await this.customerRepository.findOneByCondition({
          integration_id,
        });

      if (customerAlreadyCreated) {
        throw new RpcException('Cliente já está criado!');
      }

      const customer = await this.customerRepository.create({
        integration_id,
        name,
        email,
      });

      this.logger.log(`Customer created! ID: ${customer.id}`);

      return {
        success: true,
        message: 'Cliente Criado!',
        details: {
          customer_id: customer.id,
        },
      };
    } catch (error) {
      this.logger.error(error, error.stack);
      throw new RpcException(error?.message || error);
    }
  }
}
