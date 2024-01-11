import { AdministratorsRepository } from '@/domain/logistic/application/repositories/administrators-repository'
import { Administrator } from '@/domain/logistic/enterprise/entities/Administrator'
import { PrismaService } from '../prisma.service'
import { PrismaAdministratorMapper } from '../mappers/prisma-administrator-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAdministratorsRepository
  implements AdministratorsRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Administrator | null> {
    const administrator = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!administrator) {
      return null
    }

    return PrismaAdministratorMapper.toDomain(administrator)
  }

  async findByCPF(cpf: string): Promise<Administrator | null> {
    const administrator = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (!administrator) {
      return null
    }

    return PrismaAdministratorMapper.toDomain(administrator)
  }

  async findByEmail(email: string): Promise<Administrator | null> {
    const administrator = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!administrator) {
      return null
    }

    return PrismaAdministratorMapper.toDomain(administrator)
  }

  async create(administrator: Administrator): Promise<void> {
    const data = PrismaAdministratorMapper.toPrisma(administrator)

    await this.prisma.user.create({
      data,
    })
  }

  async save(administrator: Administrator): Promise<void> {
    const data = PrismaAdministratorMapper.toPrisma(administrator)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(administrator: Administrator): Promise<void> {
    const data = PrismaAdministratorMapper.toPrisma(administrator)

    await this.prisma.order.delete({
      where: {
        id: data.id,
      },
    })
  }
}
