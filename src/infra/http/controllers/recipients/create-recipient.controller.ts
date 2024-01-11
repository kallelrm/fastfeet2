import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CreateRecipientUseCase } from '@/domain/logistic/application/use-cases/recipient/create-recipient'
import { RecipientAlreadyExistsError } from '@/domain/logistic/application/use-cases/recipient/errors/recipient-already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

const createRecipientBodySchema = z.object({
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

const bodyValidationPipe = new ZodValidationPipe(createRecipientBodySchema)

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>

@Controller('/recipients')
export class CreateRecipientController {
  constructor(private createRecipient: CreateRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  async create(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateRecipientBodySchema,
  ) {
    const { sub: adminId } = user
    const {
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

    const result = await this.createRecipient.execute({
      adminId,
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
