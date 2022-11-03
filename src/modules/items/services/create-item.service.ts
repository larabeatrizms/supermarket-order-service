import { Inject, Logger } from '@nestjs/common';

import { CreateItemDto } from '../dtos/create-item.dto';
import { RpcException } from '@nestjs/microservices';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { ItemRepositoryInterface } from '../repositories/item/item.interface.repository';

export class CreateItemService {
  private readonly logger = new Logger(CreateItemService.name);

  constructor(
    @Inject('ItemRepositoryInterface')
    private readonly itemRepository: ItemRepositoryInterface,
  ) {}

  async execute(data: CreateItemDto): Promise<ISuccessResponse | Error> {
    try {
      this.logger.log('Creating a item...');

      this.logger.log('Validating fields...');

      const { integration_id, price, name, image } = data;

      const itemAlreadyCreated = await this.itemRepository.findOneByCondition({
        integration_id,
      });

      if (itemAlreadyCreated) {
        throw new RpcException('Item já está criado!');
      }

      const item = await this.itemRepository.create({
        integration_id,
        price,
        name,
        image,
      });

      this.logger.log(`Item created! ID: ${item.id}`);

      return {
        success: true,
        message: 'Item Criado!',
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
