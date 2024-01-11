import { RegisterAdministratorUseCase } from '@/domain/logistic/application/use-cases/administrators/register-administrator'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { AdministratorAlreadyExistsError } from '@/domain/logistic/application/use-cases/administrators/errors/administrator-already-exists-error'
import { Public } from '@/infra/auth/public'

const registerUserBodySchema = z.object({
  name: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  cpf: z.string(),
  phone: z.string(),
  password: z.string().min(6),
})

const bodyValidationPipe = new ZodValidationPipe(registerUserBodySchema)

type RegisterUserBodySchema = z.infer<typeof registerUserBodySchema>

@Controller('/admins')
@Public()
export class RegisterAdministratorController {
  constructor(private registerAdministrator: RegisterAdministratorUseCase) {}

  @Post()
  @HttpCode(201)
  async create(@Body(bodyValidationPipe) body: RegisterUserBodySchema) {
    const { name, lastname, email, password, cpf, phone } = body

    const result = await this.registerAdministrator.execute({
      name,
      lastname,
      email,
      password,
      cpf,
      phone,
    })

    if (result.isError()) {
      const error = result.value

      switch (error.constructor) {
        case AdministratorAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
