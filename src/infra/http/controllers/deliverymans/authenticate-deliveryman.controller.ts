import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { Public } from '@/infra/auth/public'
import { WrongCredentialsError } from '@/core/errors/errors/wrong-credentials-error'
import { AuthenticateDeliverymanUseCase } from '@/domain/logistic/application/use-cases/deliveryman/authenticate-deliveryman'

const AuthenticateBodySchema = z.object({
  cpf: z.string(),
  password: z.string().min(6),
})

type AuthenticateBodySchema = z.infer<typeof AuthenticateBodySchema>

@Controller('/sessions/deliveryman')
@Public()
export class AuthenticateDeliverymanController {
  constructor(private authenticateUser: AuthenticateDeliverymanUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(AuthenticateBodySchema))
  async create(@Body() body: AuthenticateBodySchema) {
    const { cpf, password } = body

    const result = await this.authenticateUser.execute({
      cpf,
      password,
    })

    if (result.isError()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
