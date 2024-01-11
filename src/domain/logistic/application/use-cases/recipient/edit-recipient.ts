import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AdministratorsRepository } from '../../repositories/administrators-repository'
import { RecipientsRepository } from '../../repositories/recipients-repository'
import { RecipientAlreadyExistsError } from './errors/recipient-already-exists-error'
import { Recipient } from '@/domain/logistic/enterprise/entities/recipient'
import { Either, failure, success } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface EditRecipientUseCaseRequest {
  adminId: string
  recipientId: string
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

type EditRecipientUseCaseResponse = Either<
  ResourceNotFoundError | RecipientAlreadyExistsError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class EditRecipientUseCase {
  constructor(
    private administratorsRepository: AdministratorsRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    adminId,
    recipientId,
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
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return failure(new ResourceNotFoundError())
    }

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

    recipient.name = name
    recipient.email = email
    recipient.phone = phone
    recipient.street = street
    recipient.number = number
    recipient.city = city
    recipient.state = state
    recipient.zipcode = zipcode
    recipient.latitude = latitude
    recipient.longitude = longitude

    await this.recipientsRepository.save(recipient)

    return success({
      recipient,
    })
  }
}
