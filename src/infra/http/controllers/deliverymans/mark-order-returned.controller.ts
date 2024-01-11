import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  HttpCode,
  BadRequestException,
  Controller,
  MethodNotAllowedException,
  Param,
  Post,
} from '@nestjs/common'
import { MarkOrderReturnedUseCase } from '@/domain/logistic/application/use-cases/deliveryman/mark-order-returned'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

@Controller('/orders/:orderId/returned')
export class MarkOrderReturnedController {
  constructor(private markOrderReturned: MarkOrderReturnedUseCase) {}

  @Post()
  @HttpCode(204)
  async create(
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const { sub: deliverymanId } = user

    const result = await this.markOrderReturned.execute({
      deliverymanId,
      orderId,
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
