import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Administrator } from '@/domain/logistic/enterprise/entities/Administrator'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaAdministratorMapper {
  static toDomain(raw: PrismaUser): Administrator {
    return Administrator.create(
      {
        cpf: raw.cpf,
        password: raw.password,
        name: raw.name,
        email: raw.email,
        lastname: raw.lastname,
        phone: raw.phone,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    administrator: Administrator,
  ): Prisma.UserUncheckedCreateInput {
    return {
      id: administrator.id.toString(),
      cpf: administrator.cpf,
      email: administrator.email,
      password: administrator.password,
      name: administrator.name,
      lastname: administrator.lastname,
      phone: administrator.phone,
      role: 'ADMIN',
    }
  }
}
