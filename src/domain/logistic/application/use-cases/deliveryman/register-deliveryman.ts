import { Deliveryman } from '@/domain/logistic/enterprise/entities/deliveryman'
import { AdministratorsRepository } from '@/domain/logistic/application/repositories/administrators-repository'
import { DeliverymansRepository } from '@/domain/logistic/application/repositories/deliverymans-repository'
import { HashGenerator } from '@/domain/logistic/application/cryptography/hash-generator'
import { DeliverymanAlreadyExistsError } from './errors/deliveryman-already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Either, failure, success } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface RegisterDeliverymanUseCaseRequest {
  adminId: string
  name: string
  lastname: string
  email: string
  cpf: string
  phone: string
  password: string
}

type RegisterDeliverymanUseCaseResponse = Either<
  ResourceNotFoundError | DeliverymanAlreadyExistsError,
  {
    deliveryman: Deliveryman
  }
>

@Injectable()
export class RegisterDeliverymanUseCase {
  constructor(
    private administratorsRepository: AdministratorsRepository,
    private deliverymansRepository: DeliverymansRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    adminId,
    name,
    lastname,
    email,
    cpf,
    phone,
    password,
  }: RegisterDeliverymanUseCaseRequest): Promise<RegisterDeliverymanUseCaseResponse> {
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

    const hashedPassword = await this.hashGenerator.hash(password)

    const deliveryman = Deliveryman.create({
      name,
      lastname,
      email,
      cpf,
      phone,
      password: hashedPassword,
    })

    await this.deliverymansRepository.create(deliveryman)

    return success({
      deliveryman,
    })
  }
}
