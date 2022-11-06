import { Inject, Logger } from '@nestjs/common';

import { CreateItemDto } from '../dtos/create-item.dto';
import { RpcException } from '@nestjs/microservices';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { ItemRepositoryInterface } from '../repositories/item/item.interface.repository';
import { UpdateItemDto } from '../dtos/update-item.dto';

export class UpdateItemService {
  private readonly logger = new Logger(UpdateItemService.name);

  constructor(
    @Inject('ItemRepositoryInterface')
    private readonly itemRepository: ItemRepositoryInterface,
  ) {}

  async execute(data: UpdateItemDto): Promise<ISuccessResponse | Error> {
    try {
      this.logger.log('Updating a item...');

      const { integration_id, name, price } = data;

      const item = await this.itemRepository.findOneByCondition({
        integration_id,
      });

      if (!item) {
        throw new RpcException('Produto não encontrado!');
      }

      item.name = name;
      item.price = price;

      await this.itemRepository.update(item);

      this.logger.log(`Item updated! ID: ${item.id}`);

      return {
        success: true,
        message: 'Item Atualizado!',
        details: {
          item_id: item.id,
        },
      };
    } catch (error) {
      this.logger.error(error, error.stack);
      throw new RpcException(error?.message || error);
    }
  }
}
