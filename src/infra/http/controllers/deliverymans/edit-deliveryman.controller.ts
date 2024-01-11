import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { EditDeliverymanUseCase } from '@/domain/logistic/application/use-cases/deliveryman/edit-deliveryman'
import { DeliverymanAlreadyExistsError } from '@/domain/logistic/application/use-cases/deliveryman/errors/deliveryman-already-exists-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

const editUserBodySchema = z.object({
  deliverymanId: z.string().uuid(),
  name: z.string(),
  cpf: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  phone: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editUserBodySchema)

type EditUserBodySchema = z.infer<typeof editUserBodySchema>

@Controller('/deliveryman')
export class EditDeliverymanController {
  constructor(private editDeliveryman: EditDeliverymanUseCase) {}

  @Put()
  @HttpCode(204)
  async create(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: EditUserBodySchema,
  ) {
    const { sub: adminId } = user
    const { deliverymanId, name, lastname, email, cpf, phone } = body

    const result = await this.editDeliveryman.execute({
      adminId,
      deliverymanId,
      name,
      lastname,
      email,
      cpf,
      phone,
    })

    if (result.isError()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case DeliverymanAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
