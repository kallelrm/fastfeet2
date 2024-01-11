import { Either, failure, success } from '@/core/either'
import { DeliverymansRepository } from '../../repositories/deliverymans-repository'
import { OrdersRepository } from '../../repositories/orders-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Order } from '@/domain/logistic/enterprise/entities/order'
import { Injectable } from '@nestjs/common'

interface FetchOrdersDeliverymansUseCaseRequest {
  deliverymanId: string
  page: number
}

type FetchOrdersDeliverymansUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchOrdersDeliverymansUseCase {
  constructor(
    private deliverymansRepository: DeliverymansRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    deliverymanId,
    page,
  }: FetchOrdersDeliverymansUseCaseRequest): Promise<FetchOrdersDeliverymansUseCaseResponse> {
    const deliveryman =
      await this.deliverymansRepository.findById(deliverymanId)

    if (!deliveryman) {
      return failure(new ResourceNotFoundError())
    }

    const orders = await this.ordersRepository.findManyByDeliverymanId(
      deliverymanId,
      { page },
    )

    return success({
      orders,
    })
  }
}
