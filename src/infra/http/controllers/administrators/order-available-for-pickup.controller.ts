import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { OrderAvailableForPickupUseCase } from '@/domain/logistic/application/use-cases/administrators/order-available-for-pickup'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  HttpCode,
  MethodNotAllowedException,
  Param,
  Post,
} from '@nestjs/common'

@Controller('/orders/:orderId/available')
export class OrderAvailableForPickupController {
  constructor(
    private orderAvailableForPickup: OrderAvailableForPickupUseCase,
  ) {}

  @Post()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const { sub: adminId } = user

    const result = await this.orderAvailableForPickup.execute({
      adminId,
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
