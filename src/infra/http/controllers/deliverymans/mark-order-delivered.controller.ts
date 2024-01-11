import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  HttpCode,
  Body,
  BadRequestException,
  Controller,
  MethodNotAllowedException,
  Param,
  Post,
} from '@nestjs/common'
import { MarkOrderDeliveredUseCase } from '@/domain/logistic/application/use-cases/deliveryman/mark-order-delivered'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

const markOrderDeliveredBodySchema = z.object({
  attachmentId: z.string().uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(markOrderDeliveredBodySchema)

type MarkOrderDeliveredBodySchema = z.infer<typeof markOrderDeliveredBodySchema>

@Controller('/orders/:orderId/delivered')
export class MarkOrderDeliveredController {
  constructor(private markOrderDelivered: MarkOrderDeliveredUseCase) {}

  @Post()
  @HttpCode(204)
  async create(
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
    @Body(bodyValidationPipe) body: MarkOrderDeliveredBodySchema,
  ) {
    const { sub: deliverymanId } = user
    const { attachmentId } = body

    const result = await this.markOrderDelivered.execute({
      deliverymanId,
      orderId,
      attachmentId,
    })

    if (result.isError()) {
      const error = result.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new MethodNotAllowedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
