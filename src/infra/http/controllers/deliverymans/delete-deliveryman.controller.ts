import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  HttpCode,
  Body,
  BadRequestException,
  Controller,
  Delete,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DeleteDeliverymanUseCase } from '@/domain/logistic/application/use-cases/deliveryman/delete-deliveryman'

const deleteDeliverymanBodySchema = z.object({
  deliverymanId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(deleteDeliverymanBodySchema)

type DeleteDeliverymanBodySchema = z.infer<typeof deleteDeliverymanBodySchema>

@Controller('/deliveryman')
export class DeleteDeliverymanController {
  constructor(private deleteDeliveryman: DeleteDeliverymanUseCase) {}

  @Delete()
  @HttpCode(204)
  async create(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: DeleteDeliverymanBodySchema,
  ) {
    const { sub: adminId } = user
    const { deliverymanId } = body

    const result = await this.deleteDeliveryman.execute({
      adminId,
      deliverymanId,
    })

    if (result.isError()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
