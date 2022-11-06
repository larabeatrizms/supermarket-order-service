import { BadRequestException, Inject, Logger } from '@nestjs/common';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { ItemRepositoryInterface } from '../repositories/item/item.interface.repository';

export class DeleteItemService {
  private readonly logger = new Logger(DeleteItemService.name);

  constructor(
    @Inject('ItemRepositoryInterface')
    private readonly itemRepository: ItemRepositoryInterface,
  ) {}

  async execute(integrationId: number): Promise<ISuccessResponse | Error> {
    this.logger.log(`Searching item... integrationId: ${integrationId}`);

    const item = await this.itemRepository.findOneByCondition({
      integration_id: integrationId,
    });

    if (!item) {
      this.logger.log('Item not found.');

      return new BadRequestException('Item não encontrado!');
    }

    await this.itemRepository.softRemove(item.id);

    this.logger.log('Item deleted.');

    return {
      success: true,
      message: 'Item deletado!',
    };
  }
}
