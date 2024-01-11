import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ChangePasswordDeliverymanUseCase } from '@/domain/logistic/application/use-cases/deliveryman/change-password-deliveryman'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  Post,
  HttpCode,
  Body,
  ConflictException,
  BadRequestException,
  Controller,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { PasswordsNotEqualsError } from '@/domain/logistic/application/use-cases/deliveryman/errors/passwords-not-equals-error'

const changePasswordBodySchema = z.object({
  deliverymanId: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(changePasswordBodySchema)

type ChangePasswordBodySchema = z.infer<typeof changePasswordBodySchema>

@Controller('/deliveryman/change-password')
export class ChangePasswordDeliverymanController {
  constructor(private changePassword: ChangePasswordDeliverymanUseCase) {}

  @Post()
  @HttpCode(204)
  async create(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: ChangePasswordBodySchema,
  ) {
    const { sub: adminId } = user
    const { deliverymanId, confirmPassword, password } = body

    const result = await this.changePassword.execute({
      adminId,
      deliverymanId,
      password,
      confirmPassword,
    })

    if (result.isError()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case PasswordsNotEqualsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
