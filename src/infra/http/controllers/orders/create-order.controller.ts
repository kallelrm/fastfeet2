import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  MethodNotAllowedException,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CreateOrderUseCase } from '@/domain/logistic/application/use-cases/order/create-order'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

const createOrderBodySchema = z.object({
  recipientId: z.string().uuid(),
  deliverymanId: z.string().uuid(),
  name: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createOrderBodySchema)

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>

@Controller('/orders')
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateOrderBodySchema,
  ) {
    const { sub: adminId } = user
    const { deliverymanId, recipientId, name } = body

    const result = await this.createOrder.execute({
      adminId,
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
