import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerController } from './handlers/customer.handler';

import { Customer } from './entities/customer.entity';

import { CustomerRepository } from './repositories/customer/customer.repository';

import { CreateCustomerService } from './services/create-customer.service';
import { UpdateCustomerService } from './services/update-customer.service';
import { DeleteCustomerService } from './services/delete-customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  providers: [
    CustomerController,
    CreateCustomerService,
    DeleteCustomerService,
    UpdateCustomerService,
    {
      provide: 'CustomerRepositoryInterface',
      useClass: CustomerRepository,
    },
  ],
  controllers: [],
  exports: [],
})
export class CustomerModule {}
