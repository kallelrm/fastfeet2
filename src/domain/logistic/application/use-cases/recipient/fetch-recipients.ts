import { Either, failure, success } from '@/core/either'
import { Recipient } from '@/domain/logistic/enterprise/entities/recipient'
import { RecipientsRepository } from '../../repositories/recipients-repository'
import { AdministratorsRepository } from '../../repositories/administrators-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface FetchRecipientsUseCaseRequest {
  adminId: string
  page: number
}

type FetchRecipientsUseCaseResponse = Either<
  NotAllowedError,
  {
    recipients: Recipient[]
  }
>

@Injectable()
export class FetchRecipientsUseCase {
  constructor(
    private administratorsRepository: AdministratorsRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    adminId,
    page,
  }: FetchRecipientsUseCaseRequest): Promise<FetchRecipientsUseCaseResponse> {
    const administratorExists =
      await this.administratorsRepository.findById(adminId)

    if (!administratorExists) {
      return failure(new NotAllowedError())
    }

    const recipients = await this.recipientsRepository.findMany({ page })

    return success({
      recipients,
    })
  }
}
