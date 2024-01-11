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
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { PickUpOrderForDeliveryUseCase } from '@/domain/logistic/application/use-cases/deliveryman/pick-up-order-for-delivery'

@Controller('/orders/:orderId/pickup')
export class PickUpOrderForDeliveryController {
  constructor(private pickUpOrderForDelivery: PickUpOrderForDeliveryUseCase) {}

  @Post()
  @HttpCode(204)
  async create(
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const { sub: deliverymanId } = user

    const result = await this.pickUpOrderForDelivery.execute({
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
