import { Either, failure, success } from '@/core/either'
import { DeliverymansRepository } from '../../repositories/deliverymans-repository'
import { OrdersRepository } from '../../repositories/orders-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface MarkOrderReturnedUseCaseRequest {
  deliverymanId: string
  orderId: string
}

type MarkOrderReturnedUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>

@Injectable()
export class MarkOrderReturnedUseCase {
  constructor(
    private deliverymansRepository: DeliverymansRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    deliverymanId,
    orderId,
  }: MarkOrderReturnedUseCaseRequest): Promise<MarkOrderReturnedUseCaseResponse> {
    const deliveryman =
      await this.deliverymansRepository.findById(deliverymanId)

    if (!deliveryman) {
      return failure(new NotAllowedError())
    }

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return failure(new ResourceNotFoundError())
    }

    if (deliverymanId !== order.deliverymanId.toString()) {
      return failure(new NotAllowedError())
    }

    order.status = 'D'
    order.returnedAt = new Date()

    await this.ordersRepository.save(order)

    return success(null)
  }
}
