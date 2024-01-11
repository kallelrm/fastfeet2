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
import { DeleteOrderUseCase } from '@/domain/logistic/application/use-cases/order/delete-order'

const deleteOrderBodySchema = z.object({
  orderId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(deleteOrderBodySchema)

type DeleteOrderBodySchema = z.infer<typeof deleteOrderBodySchema>

@Controller('/orders')
export class DeleteOrderController {
  constructor(private deleteOrder: DeleteOrderUseCase) {}

  @Delete()
  @HttpCode(204)
  async create(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: DeleteOrderBodySchema,
  ) {
    const { sub: adminId } = user
    const { orderId } = body

    const result = await this.deleteOrder.execute({
      adminId,
      orderId,
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
