import { FetchNearbyOrdersUseCase } from '@/domain/logistic/application/use-cases/deliveryman/fetch-nearby-orders'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { OrderPresenter } from '../../presenters/order-presenter'

const nearbyOrdersQuerySchema = z.object({
  latitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  longitude: z.coerce.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
})

const queryValidationPipe = new ZodValidationPipe(nearbyOrdersQuerySchema)

type NearbyOrdersQuerySchema = z.infer<typeof nearbyOrdersQuerySchema>

@Controller('/orders/nearby')
export class FetchNearbyOrdersController {
  constructor(private fetchNearbyOrders: FetchNearbyOrdersUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(queryValidationPipe) query: NearbyOrdersQuerySchema,
  ) {
    const { sub: deliverymanId } = user
    const { page, latitude, longitude } = query

    const result = await this.fetchNearbyOrders.execute({
      deliverymanId,
      page,
      userLatitude: latitude,
      userLongitude: longitude,
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    const orders = result.value.orders

    return { orders: orders.map(OrderPresenter.toHTTP) }
  }
}
