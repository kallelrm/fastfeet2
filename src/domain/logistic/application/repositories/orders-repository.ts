import { PaginationParams } from '@/core/repositories/paginations-params'
import { Order } from '../../enterprise/entities/order'

export type FindManyNearbyParams = PaginationParams & {
  latitude: number
  longitude: number
}

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract findMany(params: PaginationParams): Promise<Order[]>
  abstract findManyByDeliverymanId(
    id: string,
    params: PaginationParams,
  ): Promise<Order[]>

  abstract findManyByDeliverymanAndNearby(
    id: string,
    params: FindManyNearbyParams,
  ): Promise<Order[]>

  abstract create(order: Order): Promise<void>
  abstract save(order: Order): Promise<void>
  abstract delete(order: Order): Promise<void>
}
