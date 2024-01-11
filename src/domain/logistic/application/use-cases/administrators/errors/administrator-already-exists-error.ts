import { UseCaseError } from '@/core/errors/use-case-error'

export class AdministratorAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(`Administrator with same "${identifier}" already exists.`)
  }
}
