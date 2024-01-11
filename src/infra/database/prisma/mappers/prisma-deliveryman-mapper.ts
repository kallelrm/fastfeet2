import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Deliveryman } from '@/domain/logistic/enterprise/entities/Deliveryman'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaDeliverymanMapper {
  static toDomain(raw: PrismaUser): Deliveryman {
    return Deliveryman.create(
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

  static toPrisma(deliveryman: Deliveryman): Prisma.UserUncheckedCreateInput {
    return {
      id: deliveryman.id.toString(),
      cpf: deliveryman.cpf,
      email: deliveryman.email,
      password: deliveryman.password,
      name: deliveryman.name,
      lastname: deliveryman.lastname,
      phone: deliveryman.phone,
      role: 'DELIVERYMAN',
    }
  }
}
