import { Either, failure, success } from '@/core/either'
import { HashComparer } from '../../cryptography/hash-comparer'
import { Encrypter } from '../../cryptography/encrypter'
import { WrongCredentialsError } from '@/core/errors/errors/wrong-credentials-error'
import { AdministratorsRepository } from '../../repositories/administrators-repository'
import { Injectable } from '@nestjs/common'

interface AuthenticateAdministratorUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateAdministratorUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateAdministratorUseCase {
  constructor(
    private administratorsRepository: AdministratorsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateAdministratorUseCaseRequest): Promise<AuthenticateAdministratorUseCaseResponse> {
    const administrator = await this.administratorsRepository.findByCPF(cpf)

    if (!administrator) {
      return failure(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      administrator.password,
    )

    if (!isPasswordValid) {
      return failure(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: administrator.id.toString(),
    })

    return success({
      accessToken,
    })
  }
}
