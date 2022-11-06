import { Inject, Logger } from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { CustomerRepositoryInterface } from '../repositories/customer/customer.interface.repository';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';

export class UpdateCustomerService {
  private readonly logger = new Logger(UpdateCustomerService.name);

  constructor(
    @Inject('CustomerRepositoryInterface')
    private readonly customerRepository: CustomerRepositoryInterface,
  ) {}

  async execute(data: UpdateCustomerDto): Promise<ISuccessResponse | Error> {
    try {
      this.logger.log('Updating a customer...');

      const { integration_id, name, email } = data;

      const customer = await this.customerRepository.findOneByCondition({
        integration_id,
      });

      if (!customer) {
        throw new RpcException('Cliente não encontrado!');
      }

      customer.name = name;
      customer.email = email;

      await this.customerRepository.update(customer);

      this.logger.log(`Customer updated! ID: ${customer.id}`);

      return {
        success: true,
        message: 'Cliente Atualizado!',
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
