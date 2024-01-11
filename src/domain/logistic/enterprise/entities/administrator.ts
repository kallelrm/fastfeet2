import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface AdministratorProps {
  name: string
  lastname: string
  email: string
  cpf: string
  phone: string
  password: string
  createdAt: Date
}

export class Administrator extends Entity<AdministratorProps> {
  get name() {
    return this.props.name
  }

  get lastname() {
    return this.props.lastname
  }

  get email() {
    return this.props.email
  }

  get cpf() {
    return this.props.cpf
  }

  get phone() {
    return this.props.phone
  }

  get password() {
    return this.props.password
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<AdministratorProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const administrator = new Administrator(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return administrator
  }
}
