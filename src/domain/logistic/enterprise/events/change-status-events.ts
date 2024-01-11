import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Order } from '../entities/order'

export class ChangeStatusEvent implements DomainEvent {
  public ocurredAt: Date
  public status: string
  public order: Order

  constructor(order: Order) {
    this.ocurredAt = new Date()
    this.order = order
    this.status = order.status
  }

  getAggregateId(): UniqueEntityID {
    return this.order.id
  }
}
