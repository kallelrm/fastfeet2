import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/logistic/enterprise/entities/order'
import { Prisma, Order as PrismaOrder } from '@prisma/client'

export class PrismaOrdersMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        recipientId: new UniqueEntityID(raw.recipientId),
        deliverymanId: new UniqueEntityID(raw.userId),
        name: raw.name,
        status: raw.status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      userId: order.deliverymanId.toString(),
      name: order.name,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}
