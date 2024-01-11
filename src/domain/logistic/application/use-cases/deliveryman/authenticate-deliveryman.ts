import { Either, failure, success } from '@/core/either'
import { HashComparer } from '../../cryptography/hash-comparer'
import { Encrypter } from '../../cryptography/encrypter'
import { WrongCredentialsError } from '@/core/errors/errors/wrong-credentials-error'
import { DeliverymansRepository } from '../../repositories/deliverymans-repository'
import { Injectable } from '@nestjs/common'

interface AuthenticateDeliverymanUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateDeliverymanUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateDeliverymanUseCase {
  constructor(
    private deliverymansRepository: DeliverymansRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateDeliverymanUseCaseRequest): Promise<AuthenticateDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymansRepository.findByIdentifier(cpf)

    if (!deliveryman) {
      return failure(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      deliveryman.password,
    )

    if (!isPasswordValid) {
      return failure(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: deliveryman.id.toString(),
    })

    return success({
      accessToken,
    })
  }
}
