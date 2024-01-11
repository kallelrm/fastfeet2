import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Administrator,
  AdministratorProps,
} from '@/domain/logistic/enterprise/entities/administrator'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaAdministratorMapper } from '@/infra/database/prisma/mappers/prisma-administrator-mapper'

export function makeAdministrator(
  override: Partial<AdministratorProps> = {},
  id?: UniqueEntityID,
) {
  const administrator = Administrator.create(
    {
      name: faker.person.firstName(),
      lastname: faker.person.lastName(),
      cpf: faker.phone.number(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return administrator
}

@Injectable()
export class AdministratorFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdministrator(
    data: Partial<AdministratorProps> = {},
  ): Promise<Administrator> {
    const administrator = makeAdministrator(data)

    await this.prisma.user.create({
      data: PrismaAdministratorMapper.toPrisma(administrator),
    })

    return administrator
  }
}
