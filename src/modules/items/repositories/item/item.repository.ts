import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/repositories/base/base.abstract.repository';
import { ItemRepositoryInterface } from './item.interface.repository';
import { Item } from '../../entities/item.entity';

@Injectable()
export class ItemRepository
  extends BaseAbstractRepository<Item>
  implements ItemRepositoryInterface
{
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {
    super(itemsRepository);
  }
}
