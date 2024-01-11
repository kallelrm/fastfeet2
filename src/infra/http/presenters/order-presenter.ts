import { Order } from '@/domain/logistic/enterprise/entities/order'

export class OrderPresenter {
  static toHTTP(raw: Order) {
    return {
      id: raw.id.toString(),
      name: raw.name,
      recipientId: raw.recipientId.toString(),
      deliverymanId: raw.deliverymanId.toString(),
      status: raw.status,
      postedAt: raw.postedAt,
      retiredAt: raw.retiredAt,
      returnedAt: raw.returnedAt,
      deliveredAt: raw.deliveredAt,
    }
  }
}
