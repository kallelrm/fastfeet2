import { Either, failure, success } from '@/core/either'
import { DeliverymansRepository } from '../../repositories/deliverymans-repository'
import { OrdersRepository } from '../../repositories/orders-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface PickUpOrderForDeliveryUseCaseRequest {
  deliverymanId: string
  orderId: string
}

type PickUpOrderForDeliveryUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>

@Injectable()
export class PickUpOrderForDeliveryUseCase {
  constructor(
    private deliverymansRepository: DeliverymansRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    deliverymanId,
    orderId,
  }: PickUpOrderForDeliveryUseCaseRequest): Promise<PickUpOrderForDeliveryUseCaseResponse> {
    const deliveryman =
      await this.deliverymansRepository.findById(deliverymanId)

    if (!deliveryman) {
      return failure(new NotAllowedError())
    }

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return failure(new ResourceNotFoundError())
    }

    order.deliverymanId = deliveryman.id
    order.status = 'R'
    order.retiredAt = new Date()

    await this.ordersRepository.save(order)

    return success(null)
  }
}
