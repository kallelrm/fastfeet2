import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  MethodNotAllowedException,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { EditOrderUseCase } from '@/domain/logistic/application/use-cases/order/Edit-order'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

const EditOrderBodySchema = z.object({
  orderId: z.string().uuid(),
  recipientId: z.string().uuid(),
  deliverymanId: z.string().uuid(),
  name: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(EditOrderBodySchema)

type EditOrderBodySchema = z.infer<typeof EditOrderBodySchema>

@Controller('/orders')
export class EditOrderController {
  constructor(private EditOrder: EditOrderUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: EditOrderBodySchema,
  ) {
    const { sub: adminId } = user
    const { orderId, deliverymanId, recipientId, name } = body

    const result = await this.EditOrder.execute({
      adminId,
      orderId,
      deliverymanId,
      recipientId,
      name,
    })

    if (result.isError()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case NotAllowedError:
          throw new MethodNotAllowedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
