import { UseCaseError } from '@/core/errors/use-case-error'

export class DeliverymanAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(`Deliveryman with same "${identifier}" already exists.`)
  }
}
