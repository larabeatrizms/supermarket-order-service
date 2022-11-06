import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/repositories/base/base.abstract.repository';
import { CustomerRepositoryInterface } from './customer.interface.repository';
import { Customer } from '../../entities/customer.entity';

@Injectable()
export class CustomerRepository
  extends BaseAbstractRepository<Customer>
  implements CustomerRepositoryInterface
{
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {
    super(customersRepository);
  }
}
