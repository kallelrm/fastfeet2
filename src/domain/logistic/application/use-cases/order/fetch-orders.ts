import { Either, failure, success } from '@/core/either'
import { Order } from '@/domain/logistic/enterprise/entities/order'
import { OrdersRepository } from '../../repositories/orders-repository'
import { AdministratorsRepository } from '../../repositories/administrators-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface FetchOrdersUseCaseRequest {
  adminId: string
  page: number
}

type FetchOrdersUseCaseResponse = Either<
  NotAllowedError,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchOrdersUseCase {
  constructor(
    private administratorsRepository: AdministratorsRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    adminId,
    page,
  }: FetchOrdersUseCaseRequest): Promise<FetchOrdersUseCaseResponse> {
    const administrator = await this.administratorsRepository.findById(adminId)

    if (!administrator) {
      return failure(new NotAllowedError())
    }

    const orders = await this.ordersRepository.findMany({ page })

    return success({
      orders,
    })
  }
}
