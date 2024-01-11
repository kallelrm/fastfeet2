import { Either, failure, success } from '@/core/either'
import { Order } from '@/domain/logistic/enterprise/entities/order'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

import { OrdersRepository } from '../../repositories/orders-repository'
import { AdministratorsRepository } from '../../repositories/administrators-repository'
import { DeliverymansRepository } from '../../repositories/deliverymans-repository'
import { RecipientsRepository } from '../../repositories/recipients-repository'
import { Injectable } from '@nestjs/common'

interface EditOrderUseCaseRequest {
  adminId: string
  orderId: string
  recipientId: string
  deliverymanId: string
  name: string
}

type EditOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order
  }
>

@Injectable()
export class EditOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private administratorsRepository: AdministratorsRepository,
    private deliverymansRepository: DeliverymansRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    adminId,
    orderId,
    recipientId,
    deliverymanId,
    name,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return failure(new ResourceNotFoundError())
    }

    const administrator = await this.administratorsRepository.findById(adminId)

    if (!administrator) {
      return failure(new NotAllowedError())
    }

    const deliveryman =
      await this.deliverymansRepository.findById(deliverymanId)

    if (!deliveryman) {
      return failure(new ResourceNotFoundError())
    }

    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return failure(new ResourceNotFoundError())
    }

    order.name = name
    order.deliverymanId = deliveryman.id
    order.recipientId = recipient.id

    await this.ordersRepository.save(order)

    return success({
      order,
    })
  }
}
