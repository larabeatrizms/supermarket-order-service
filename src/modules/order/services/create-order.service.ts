import { Inject, Logger } from '@nestjs/common';

import { CreateOrderDto, CreateOrderItemDto } from '../dtos/create-order.dto';
import { RpcException } from '@nestjs/microservices';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { OrderRepositoryInterface } from '../repositories/order/order.interface.repository';
import { ItemRepositoryInterface } from 'src/modules/items/repositories/item/item.interface.repository';
import { OrderItemRepositoryInterface } from '../repositories/order-item/order-item.interface.repository';
import { IOrderItem } from '../interfaces/order-item.interface';
import { OrderShipmentRepositoryInterface } from '../repositories/order-shipment/order-shipment.interface.repository';
import { OrderPaymentRepositoryInterface } from '../repositories/order-payment/order-payment.interface.repository';
import { EOrderPaymentStatus } from '../enums/order-payment-status.enum';
import { EOrderStatusCode } from '../enums/order-status-code.enum';
import { CustomerRepositoryInterface } from 'src/modules/customers/repositories/customer/customer.interface.repository';

export class CreateOrderService {
  private readonly logger = new Logger(CreateOrderService.name);

  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,
    @Inject('ItemRepositoryInterface')
    private readonly itemRepository: ItemRepositoryInterface,
    @Inject('OrderItemRepositoryInterface')
    private readonly orderItemRepository: OrderItemRepositoryInterface,
    @Inject('OrderShipmentRepositoryInterface')
    private readonly orderShipmentRepository: OrderShipmentRepositoryInterface,
    @Inject('OrderPaymentRepositoryInterface')
    private readonly orderPaymentRepository: OrderPaymentRepositoryInterface,
    @Inject('CustomerRepositoryInterface')
    private readonly customerRepository: CustomerRepositoryInterface,
  ) {}

  async execute(data: CreateOrderDto): Promise<ISuccessResponse | Error> {
    try {
      this.logger.log('Creating a order...');

      const { user_id, items, shipment, payment } = data;

      this.logger.log('Searching customer...');

      const customer = await this.customerRepository.findOneByCondition({
        integration_id: user_id,
      });

      if (!customer) {
        throw new RpcException(`Cliente não encontrado!`);
      }

      this.logger.log('Searching products...');

      // Busca Id do item com base no "product_id" recebido.
      // Valida se o valor do Item encontrado é o mesmo do recebido.
      const orderItemsToCreate: Pick<
        IOrderItem,
        'price' | 'quantity' | 'item_id'
      >[] = await Promise.all(
        items.map(async (item: CreateOrderItemDto) => {
          const { product_id, price, quantity, name } = item;

          const itemFounded = await this.itemRepository.findOneByCondition({
            integration_id: product_id,
          });

          if (!itemFounded) {
            throw new RpcException(`Produto "${name}" não encontrado!`);
          }

          if (itemFounded.price !== price) {
            throw new RpcException(`Valor item "${name}" está incorreto!`);
          }

          return {
            price,
            item_id: itemFounded.id,
            quantity,
          };
        }),
      );

      this.logger.log('Creating order shipment...');

      // Cria OrderShipment com o endereço recebido.
      const orderShipment = await this.orderShipmentRepository.create({
        zipcode: shipment.zipcode,
        to_address: shipment.to_address,
      });

      this.logger.log('Creating order payment...');

      const orderPaymentAmount = items.reduce(
        (pV, cV) => pV + cV.price * cV.quantity,
        0,
      );

      // Cria OrderPayment com o método de pagamento recebido.
      const orderPayment = await this.orderPaymentRepository.create({
        type: payment.type,
        amount: orderPaymentAmount,
        status: EOrderPaymentStatus.CONCLUDED,
      });

      this.logger.log('Creating order...');

      // Cria pedido com OrderPayment, OrderShipment e status inicial.
      const order = await this.orderRepository.create({
        customer_id: customer.id,
        payment_id: orderPayment.id,
        shipment_id: orderShipment.id,
        status: EOrderStatusCode.PLACED,
      });

      this.logger.log('Creating order items...');

      // Cria OrderItem com os items enviados.
      // Vincula Item com OrderItem.
      // Vincula Order com OrderItem.
      await Promise.all(
        orderItemsToCreate.map(async (orderItemToCreate) =>
          this.orderItemRepository.create({
            order_id: order.id,
            item_id: orderItemToCreate.item_id,
            quantity: orderItemToCreate.quantity,
            price: orderItemToCreate.price,
          }),
        ),
      );

      this.logger.log(`Order created! ID: ${order.id}`);

      return {
        success: true,
        message: 'Pedido Criado!',
        details: {
          order_id: order.id,
          payment_id: order.payment_id,
          shipment_id: order.shipment_id,
          status: order.status,
        },
      };
    } catch (error) {
      this.logger.error(error, error.stack);
      throw new RpcException(error?.message || error);
    }
  }
}
