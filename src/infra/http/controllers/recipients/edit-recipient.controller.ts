import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { EditRecipientUseCase } from '@/domain/logistic/application/use-cases/recipient/edit-recipient'
import { RecipientAlreadyExistsError } from '@/domain/logistic/application/use-cases/recipient/errors/recipient-already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

const editRecipientBodySchema = z.object({
  recipientId: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  street: z.string(),
  number: z.string(),
  city: z.string(),
  state: z.string(),
  zipcode: z.string(),
  latitude: z.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  longitude: z.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
})

const bodyValidationPipe = new ZodValidationPipe(editRecipientBodySchema)

type EditRecipientBodySchema = z.infer<typeof editRecipientBodySchema>

@Controller('/recipients')
export class EditRecipientController {
  constructor(private editRecipient: EditRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  async edit(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: EditRecipientBodySchema,
  ) {
    const { sub: adminId } = user
    const {
      recipientId,
      name,
      email,
      phone,
      street,
      number,
      city,
      state,
      zipcode,
      latitude,
      longitude,
    } = body

    const result = await this.editRecipient.execute({
      adminId,
      recipientId,
      name,
      email,
      phone,
      street,
      number,
      city,
      state,
      zipcode,
      latitude,
      longitude,
    })

    if (result.isError()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case RecipientAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
