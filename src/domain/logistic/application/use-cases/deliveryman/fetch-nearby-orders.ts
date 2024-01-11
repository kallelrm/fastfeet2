import { Either, failure, success } from '@/core/either'
import { DeliverymansRepository } from '../../repositories/deliverymans-repository'
import { OrdersRepository } from '../../repositories/orders-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Order } from '@/domain/logistic/enterprise/entities/order'
import { Injectable } from '@nestjs/common'

interface FetchNearbyOrdersUseCaseRequest {
  deliverymanId: string
  userLatitude: number
  userLongitude: number
  page: number
}

type FetchNearbyOrdersUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchNearbyOrdersUseCase {
  constructor(
    private deliverymansRepository: DeliverymansRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    deliverymanId,
    userLatitude,
    userLongitude,
    page,
  }: FetchNearbyOrdersUseCaseRequest): Promise<FetchNearbyOrdersUseCaseResponse> {
    const deliveryman =
      await this.deliverymansRepository.findById(deliverymanId)

    if (!deliveryman) {
      return failure(new ResourceNotFoundError())
    }

    const orders = await this.ordersRepository.findManyByDeliverymanAndNearby(
      deliverymanId,
      { page, latitude: userLatitude, longitude: userLongitude },
    )

    return success({
      orders,
    })
  }
}
