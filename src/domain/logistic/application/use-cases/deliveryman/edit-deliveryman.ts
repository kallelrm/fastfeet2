import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AdministratorsRepository } from '../../repositories/administrators-repository'
import { DeliverymansRepository } from '../../repositories/deliverymans-repository'
import { DeliverymanAlreadyExistsError } from './errors/deliveryman-already-exists-error'
import { Deliveryman } from '@/domain/logistic/enterprise/entities/deliveryman'
import { Either, failure, success } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface EditDeliverymanUseCaseRequest {
  adminId: string
  deliverymanId: string
  email: string
  cpf: string
  name?: string
  lastname?: string
  phone?: string
}

type EditDeliverymanUseCaseResponse = Either<
  ResourceNotFoundError | DeliverymanAlreadyExistsError,
  {
    deliveryman: Deliveryman
  }
>

@Injectable()
export class EditDeliverymanUseCase {
  constructor(
    private administratorsRepository: AdministratorsRepository,
    private deliverymansRepository: DeliverymansRepository,
  ) {}

  async execute({
    adminId,
    deliverymanId,
    name,
    lastname,
    email,
    cpf,
    phone,
  }: EditDeliverymanUseCaseRequest): Promise<EditDeliverymanUseCaseResponse> {
    const deliveryman =
      await this.deliverymansRepository.findById(deliverymanId)

    if (!deliveryman) {
      return failure(new ResourceNotFoundError())
    }

    const administratorExists =
      await this.administratorsRepository.findById(adminId)

    if (!administratorExists) {
      return failure(new ResourceNotFoundError())
    }

    const deliverymanWithSameIdentifier =
      await this.deliverymansRepository.findByIdentifier(cpf)

    if (deliverymanWithSameIdentifier) {
      return failure(new DeliverymanAlreadyExistsError(cpf))
    }

    const deliverymanWithSameEmail =
      await this.deliverymansRepository.findByEmail(email)

    if (deliverymanWithSameEmail) {
      return failure(new DeliverymanAlreadyExistsError(email))
    }

    deliveryman.name = name !== undefined ? name : deliveryman.name
    deliveryman.lastname =
      lastname !== undefined ? lastname : deliveryman.lastname
    deliveryman.email = email
    deliveryman.cpf = cpf
    deliveryman.phone = phone !== undefined ? phone : deliveryman.phone

    await this.deliverymansRepository.save(deliveryman)

    return success({
      deliveryman,
    })
  }
}
