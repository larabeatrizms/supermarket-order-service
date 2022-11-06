import { BadRequestException, Inject, Logger } from '@nestjs/common';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { CustomerRepositoryInterface } from '../repositories/customer/customer.interface.repository';

export class DeleteCustomerService {
  private readonly logger = new Logger(DeleteCustomerService.name);

  constructor(
    @Inject('CustomerRepositoryInterface')
    private readonly customerRepository: CustomerRepositoryInterface,
  ) {}

  async execute(integrationId: number): Promise<ISuccessResponse | Error> {
    this.logger.log(`Searching customer... integrationId: ${integrationId}`);

    const customer = await this.customerRepository.findOneByCondition({
      integration_id: integrationId,
    });

    if (!customer) {
      this.logger.log('Customer not found.');

      return new BadRequestException('Cliente não encontrado!');
    }

    await this.customerRepository.softRemove(customer.id);

    this.logger.log('Customer deleted.');

    return {
      success: true,
      message: 'Cliente deletado!',
    };
  }
}
