import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AdministratorsRepository } from '../../repositories/administrators-repository'
import { RecipientsRepository } from '../../repositories/recipients-repository'
import { RecipientAlreadyExistsError } from './errors/recipient-already-exists-error'
import { Either, failure, success } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface DeleteRecipientUseCaseRequest {
  adminId: string
  recipientId: string
}

type DeleteRecipientUseCaseResponse = Either<
  ResourceNotFoundError | RecipientAlreadyExistsError,
  null
>

@Injectable()
export class DeleteRecipientUseCase {
  constructor(
    private administratorsRepository: AdministratorsRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    adminId,
    recipientId,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return failure(new ResourceNotFoundError())
    }

    const administratorExists =
      await this.administratorsRepository.findById(adminId)

    if (!administratorExists) {
      return failure(new ResourceNotFoundError())
    }

    await this.recipientsRepository.delete(recipient)

    return success(null)
  }
}
