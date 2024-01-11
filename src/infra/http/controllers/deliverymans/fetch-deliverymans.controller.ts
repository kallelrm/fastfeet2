import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { FetchDeliverymansUseCase } from '@/domain/logistic/application/use-cases/deliveryman/fetch-deliverymans'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeliverymanPresenter } from '../../presenters/deliveryman-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/deliverymans')
export class FetchDeliverymansController {
  constructor(private fetchDeliverymans: FetchDeliverymansUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const { sub: adminId } = user

    const result = await this.fetchDeliverymans.execute({
      adminId,
      page,
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    const deliverymans = result.value.deliverymans

    return { deliverymans: deliverymans.map(DeliverymanPresenter.toHTTP) }
  }
}
