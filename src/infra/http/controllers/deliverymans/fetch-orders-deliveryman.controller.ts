import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchOrdersDeliverymansUseCase } from '@/domain/logistic/application/use-cases/deliveryman/fetch-orders-deliverymans'
import { OrderPresenter } from '../../presenters/order-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/orders/deliverymans')
export class FetchOrdersDeliverymansController {
  constructor(
    private fetchOrdersDeliverymans: FetchOrdersDeliverymansUseCase,
  ) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const { sub: deliverymanId } = user

    const result = await this.fetchOrdersDeliverymans.execute({
      deliverymanId,
      page,
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    const orders = result.value.orders

    return { orders: orders.map(OrderPresenter.toHTTP) }
  }
}
