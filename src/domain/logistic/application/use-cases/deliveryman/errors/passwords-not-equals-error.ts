import { UseCaseError } from '@/core/errors/use-case-error'

export class PasswordsNotEqualsError extends Error implements UseCaseError {
  constructor() {
    super('Passwords are not equals.')
  }
}
