import { PaginationParams } from '@/core/repositories/paginations-params'
import {
  FindManyNearbyParams,
  OrdersRepository,
} from '@/domain/logistic/application/repositories/orders-repository'
import { Order } from '@/domain/logistic/enterprise/entities/order'
import { InMemoryOrderAttachmentRepository } from './in-memory-order-attachment-repository'
import { getDistanceBetweenCoordinates } from 'test/utils/get-distance-between-coordinates'
import { InMemoryRecipientsRepository } from './in-memory-recipients-repository'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  constructor(
    private orderAttachmentRepository: InMemoryOrderAttachmentRepository,
    private recipientsRepository: InMemoryRecipientsRepository,
  ) {}

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async findMany({ page }: PaginationParams) {
    const orders = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return orders
  }

  async findManyByDeliverymanId(
    id: string,
    { page }: PaginationParams,
  ): Promise<Order[]> {
    const orders = this.items
      .filter((item) => item.deliverymanId.toString() === id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return orders
  }

  async findManyByDeliverymanAndNearby(
    id: string,
    params: FindManyNearbyParams,
  ): Promise<Order[]> {
    const orders = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((params.page - 1) * 20, params.page * 20)
      .filter((order) => {
        const recipient = this.recipientsRepository.items.find((recipient) => {
          return recipient.id.equals(order.recipientId)
        })

        if (!recipient) {
          throw new Error(
            `Recipient with ID "${order.recipientId.toString()}" does not exist`,
          )
        }

        const distance = getDistanceBetweenCoordinates(
          {
            latitude: params.latitude,
            longitude: params.longitude,
          },
          {
            latitude: recipient.latitude,
            longitude: recipient.longitude,
          },
        )

        if (!order.deliverymanId === null) {
          throw new Error(
            `Deliveryman with ID "${order.deliverymanId.toString()}" does not exist`,
          )
        }

        return distance < 10 && order.deliverymanId.toString() === id
      })

    return orders
  }

  async create(order: Order): Promise<void> {
    this.items.push(order)
  }

  async save(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items[itemIndex] = order

    if (
      order.status === 'Entregue' &&
      order.photo !== null &&
      order.photo !== undefined
    ) {
      await this.orderAttachmentRepository.create(order.photo)
    }

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async delete(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items.splice(itemIndex, 1)
  }
}
