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
import { DeleteRecipientUseCase } from '@/domain/logistic/application/use-cases/recipient/delete-recipient'

const deleteRecipientBodySchema = z.object({
  recipientId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(deleteRecipientBodySchema)

type DeleteRecipientBodySchema = z.infer<typeof deleteRecipientBodySchema>

@Controller('/recipients')
export class DeleteRecipientController {
  constructor(private deleteRecipient: DeleteRecipientUseCase) {}

  @Delete()
  @HttpCode(204)
  async create(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: DeleteRecipientBodySchema,
  ) {
    const { sub: adminId } = user
    const { recipientId } = body

    const result = await this.deleteRecipient.execute({
      adminId,
      recipientId,
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
