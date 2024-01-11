import { Administrator } from '@/domain/logistic/enterprise/entities/administrator'
import { AdministratorsRepository } from '@/domain/logistic/application/repositories/administrators-repository'
import { HashGenerator } from '@/domain/logistic/application/cryptography/hash-generator'
import { Either, failure, success } from '@/core/either'
import { AdministratorAlreadyExistsError } from './errors/administrator-already-exists-error'
import { Injectable } from '@nestjs/common'

interface RegisterAdministratorUseCaseRequest {
  name: string
  lastname: string
  email: string
  cpf: string
  phone: string
  password: string
}

type RegisterAdministratorUseCaseResponse = Either<
  AdministratorAlreadyExistsError,
  {
    administrator: Administrator
  }
>

@Injectable()
export class RegisterAdministratorUseCase {
  constructor(
    private administratorsRepository: AdministratorsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    lastname,
    email,
    cpf,
    phone,
    password,
  }: RegisterAdministratorUseCaseRequest): Promise<RegisterAdministratorUseCaseResponse> {
    const administratorWithSameEmail =
      await this.administratorsRepository.findByEmail(email)

    if (administratorWithSameEmail) {
      return failure(new AdministratorAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const administrator = Administrator.create({
      name,
      lastname,
      email,
      cpf,
      phone,
      password: hashedPassword,
    })

    await this.administratorsRepository.create(administrator)

    return success({
      administrator,
    })
  }
}
