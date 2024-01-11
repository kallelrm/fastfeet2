import { Either, failure, success } from '@/core/either'
import { Order } from '@/domain/logistic/enterprise/entities/order'

import { AdministratorsRepository } from '../../repositories/administrators-repository'
import { DeliverymansRepository } from '../../repositories/deliverymans-repository'
import { OrdersRepository } from '../../repositories/orders-repository'
import { RecipientsRepository } from '../../repositories/recipients-repository'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface CreateOrderUseCaseRequest {
  adminId: string
  recipientId: string
  deliverymanId: string
  name: string
}

type CreateOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order
  }
>

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private administratorsRepository: AdministratorsRepository,
    private deliverymansRepository: DeliverymansRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    adminId,
    deliverymanId,
    recipientId,
    name,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
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

    const order = Order.create({
      deliverymanId: deliveryman.id,
      recipientId: recipient.id,
      name,
    })

    await this.ordersRepository.create(order)

    return success({
      order,
    })
  }
}
