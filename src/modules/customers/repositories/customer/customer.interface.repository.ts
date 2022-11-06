import { BaseInterfaceRepository } from '../../../../repositories/base/base.interface.repository';
import { Customer } from '../../entities/customer.entity';

export type CustomerRepositoryInterface = BaseInterfaceRepository<Customer>;
