import { Either, failure, success } from '@/core/either'
import { Deliveryman } from '@/domain/logistic/enterprise/entities/deliveryman'
import { DeliverymansRepository } from '../../repositories/deliverymans-repository'
import { AdministratorsRepository } from '../../repositories/administrators-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface FetchDeliverymansUseCaseRequest {
  adminId: string
  page: number
}

type FetchDeliverymansUseCaseResponse = Either<
  NotAllowedError,
  {
    deliverymans: Deliveryman[]
  }
>

@Injectable()
export class FetchDeliverymansUseCase {
  constructor(
    private administratorsRepository: AdministratorsRepository,
    private deliverymansRepository: DeliverymansRepository,
  ) {}

  async execute({
    adminId,
    page,
  }: FetchDeliverymansUseCaseRequest): Promise<FetchDeliverymansUseCaseResponse> {
    const administratorExists =
      await this.administratorsRepository.findById(adminId)

    if (!administratorExists) {
      return failure(new NotAllowedError())
    }

    const deliverymans = await this.deliverymansRepository.findMany({ page })

    return success({
      deliverymans,
    })
  }
}
