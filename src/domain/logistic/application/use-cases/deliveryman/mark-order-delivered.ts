import { Either, failure, success } from '@/core/either'
import { DeliverymansRepository } from '../../repositories/deliverymans-repository'
import { OrdersRepository } from '../../repositories/orders-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { OrderAttachment } from '@/domain/logistic/enterprise/entities/order-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

interface MarkOrderDeliveredUseCaseRequest {
  deliverymanId: string
  attachmentId: string
  orderId: string
}

type MarkOrderDeliveredUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>

@Injectable()
export class MarkOrderDeliveredUseCase {
  constructor(
    private deliverymansRepository: DeliverymansRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    deliverymanId,
    attachmentId,
    orderId,
  }: MarkOrderDeliveredUseCaseRequest): Promise<MarkOrderDeliveredUseCaseResponse> {
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

    const attachment = OrderAttachment.create({
      attachmentId: new UniqueEntityID(attachmentId),
      orderId: order.id,
    })

    order.photo = attachment
    order.status = 'Entregue'
    order.deliveredAt = new Date()

    await this.ordersRepository.save(order)

    return success(null)
  }
}
