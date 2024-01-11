import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { OrderAttachment } from './order-attachment'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { ChangeStatusEvent } from '../events/change-status-events'

export interface OrderProps {
  recipientId: UniqueEntityID
  deliverymanId: UniqueEntityID
  name: string
  status: string
  photo?: OrderAttachment | null
  postedAt?: Date | null
  retiredAt?: Date | null
  returnedAt?: Date | null
  deliveredAt?: Date | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Order extends AggregateRoot<OrderProps> {
  get recipientId() {
    return this.props.recipientId
  }

  set recipientId(id: UniqueEntityID) {
    this.props.recipientId = id
    this.touch()
  }

  get deliverymanId() {
    return this.props.deliverymanId
  }

  set deliverymanId(id: UniqueEntityID) {
    this.props.deliverymanId = id
    this.touch()
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get status() {
    return this.props.status
  }

  set status(status: string) {
    this.props.status = status
    this.touch()

    this.addDomainEvent(new ChangeStatusEvent(this))
  }

  get photo() {
    return this.props.photo
  }

  set photo(photo: OrderAttachment | null | undefined) {
    this.props.photo = photo
    this.touch()
  }

  get postedAt() {
    return this.props.postedAt
  }

  set postedAt(date: Date | null | undefined) {
    this.props.postedAt = date
    this.touch()
  }

  get retiredAt() {
    return this.props.retiredAt
  }

  set retiredAt(date: Date | null | undefined) {
    this.props.postedAt = date
    this.touch()
  }

  get returnedAt() {
    return this.props.returnedAt
  }

  set returnedAt(date: Date | null | undefined) {
    this.props.postedAt = date
    this.touch()
  }

  get deliveredAt() {
    return this.props.deliveredAt
  }

  set deliveredAt(date: Date | null | undefined) {
    this.props.postedAt = date
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<OrderProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        status: props.status ?? '',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return order
  }
}
