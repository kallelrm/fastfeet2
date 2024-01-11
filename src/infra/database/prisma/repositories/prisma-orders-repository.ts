import { PaginationParams } from '@/core/repositories/paginations-params'
import {
  FindManyNearbyParams,
  OrdersRepository,
} from '@/domain/logistic/application/repositories/orders-repository'
import { Order } from '@/domain/logistic/enterprise/entities/order'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { PrismaOrdersMapper } from '../mappers/prisma-orders-mapper'
import { PrismaService } from '../prisma.service'
import { Recipient as PrismaRecipient } from '@prisma/client'
import { OrderAttachmentRepository } from '@/domain/logistic/application/repositories/order-attachment-repository'
import { DomainEvents } from '@/core/events/domain-events'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
    private orderAttachmentRepository: OrderAttachmentRepository,
  ) {}

  async findById(id: string): Promise<Order | null> {
    const cacheHit = await this.cache.get(`order:${id}:details`)

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit)

      return cachedData
    }

    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    })

    if (!order) {
      return null
    }

    const orderDetails = PrismaOrdersMapper.toDomain(order)

    await this.cache.set(`order:${id}:details`, JSON.stringify(orderDetails))

    return orderDetails
  }

  async findMany({ page }: PaginationParams): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return orders.map((order) => PrismaOrdersMapper.toDomain(order))
  }

  async findManyByDeliverymanId(
    id: string,
    { page }: PaginationParams,
  ): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return orders.map((order) => PrismaOrdersMapper.toDomain(order))
  }

  async findManyByDeliverymanAndNearby(
    id: string,
    { page, latitude, longitude }: FindManyNearbyParams,
  ): Promise<Order[]> {
    const nearbyRecipients = await this.prisma.$queryRaw<PrismaRecipient[]>`
    SELECT * FROM recipients 
    WHERE (6371 * acos(
      cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) +
      sin(radians(${latitude})) * sin(radians(latitude))
    )) <= 0.5`

    const nearbyOrders = await this.prisma.order.findMany({
      where: {
        userId: id,
        recipientId: {
          in: nearbyRecipients.map((recipient) => recipient.id),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return nearbyOrders.map((order) => PrismaOrdersMapper.toDomain(order))
  }

  async create(order: Order): Promise<void> {
    const data = PrismaOrdersMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrdersMapper.toPrisma(order)

    await this.prisma.order.update({
      where: {
        id: data.id,
      },
      data,
    })

    await this.cache.delete(`order:${data.id}:details`)

    DomainEvents.dispatchEventsForAggregate(order.id)

    if (
      order.status === 'Entregue' &&
      order.photo !== null &&
      order.photo !== undefined
    ) {
      await this.orderAttachmentRepository.create(order.photo)
    }
  }

  async delete(order: Order): Promise<void> {
    const data = PrismaOrdersMapper.toPrisma(order)

    await this.prisma.order.delete({
      where: {
        id: data.id,
      },
    })
  }
}
