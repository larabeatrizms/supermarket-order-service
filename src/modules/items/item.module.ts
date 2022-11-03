import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemController } from './handlers/item.handler';

import { CreateItemService } from './services/create-item.service';

import { ItemRepository } from './repositories/item/item.repository';

import { Item } from './entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  providers: [
    ItemController,
    CreateItemService,
    {
      provide: 'ItemRepositoryInterface',
      useClass: ItemRepository,
    },
  ],
  controllers: [],
  exports: [],
})
export class ItemModule {}
