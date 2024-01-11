import { Recipient } from '@/domain/logistic/enterprise/entities/recipient'
import { AdministratorsRepository } from '@/domain/logistic/application/repositories/administrators-repository'
import { RecipientsRepository } from '@/domain/logistic/application/repositories/recipients-repository'
import { RecipientAlreadyExistsError } from './errors/recipient-already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Either, failure, success } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface CreateRecipientUseCaseRequest {
  adminId: string
  name: string
  email: string
  phone: string
  street: string
  number: string
  city: string
  state: string
  zipcode: string
  latitude: number
  longitude: number
}

type CreateRecipientUseCaseResponse = Either<
  ResourceNotFoundError | RecipientAlreadyExistsError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class CreateRecipientUseCase {
  constructor(
    private administratorsRepository: AdministratorsRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    adminId,
    name,
    email,
    phone,
    street,
    number,
    city,
    state,
    zipcode,
    latitude,
    longitude,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const administratorExists =
      await this.administratorsRepository.findById(adminId)

    if (!administratorExists) {
      return failure(new ResourceNotFoundError())
    }

    const recipientWithSameEmail =
      await this.recipientsRepository.findByEmail(email)

    if (recipientWithSameEmail) {
      return failure(new RecipientAlreadyExistsError(email))
    }

    const recipient = Recipient.create({
      name,
      email,
      phone,
      street,
      number,
      city,
      state,
      zipcode,
      latitude,
      longitude,
    })

    await this.recipientsRepository.create(recipient)

    return success({
      recipient,
    })
  }
}
