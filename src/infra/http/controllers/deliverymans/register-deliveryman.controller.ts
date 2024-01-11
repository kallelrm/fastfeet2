import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  MethodNotAllowedException,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { RegisterDeliverymanUseCase } from '@/domain/logistic/application/use-cases/deliveryman/register-deliveryman'
import { DeliverymanAlreadyExistsError } from '@/domain/logistic/application/use-cases/deliveryman/errors/deliveryman-already-exists-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

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

@Controller('/deliveryman')
export class RegisterDeliverymanController {
  constructor(private registerDeliveryman: RegisterDeliverymanUseCase) {}

  @Post()
  @HttpCode(201)
  async create(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: RegisterUserBodySchema,
  ) {
    const { sub: adminId } = user
    const { name, lastname, email, password, cpf, phone } = body

    const result = await this.registerDeliveryman.execute({
      adminId,
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
        case NotAllowedError:
          throw new MethodNotAllowedException(error.message)
        case DeliverymanAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
