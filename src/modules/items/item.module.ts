import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemController } from './handlers/item.handler';

import { Item } from './entities/item.entity';

import { ItemRepository } from './repositories/item/item.repository';

import { CreateItemService } from './services/create-item.service';
import { UpdateItemService } from './services/update-item.service';
import { DeleteItemService } from './services/delete-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  providers: [
    ItemController,
    CreateItemService,
    DeleteItemService,
    UpdateItemService,
    {
      provide: 'ItemRepositoryInterface',
      useClass: ItemRepository,
    },
  ],
  controllers: [],
  exports: [],
})
export class ItemModule {}
