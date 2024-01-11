import { DeliverymansRepository } from '@/domain/logistic/application/repositories/deliverymans-repository'
import { Deliveryman } from '@/domain/logistic/enterprise/entities/Deliveryman'
import { PrismaService } from '../prisma.service'
import { PrismaDeliverymanMapper } from '../mappers/prisma-deliveryman-mapper'
import { PaginationParams } from '@/core/repositories/paginations-params'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaDeliverymansRepository implements DeliverymansRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Deliveryman | null> {
    const deliveryman = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!deliveryman) {
      return null
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman)
  }

  async findByIdentifier(cpf: string): Promise<Deliveryman | null> {
    const deliveryman = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (!deliveryman) {
      return null
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman)
  }

  async findByEmail(email: string): Promise<Deliveryman | null> {
    const deliveryman = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!deliveryman) {
      return null
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman)
  }

  async findMany({ page }: PaginationParams): Promise<Deliveryman[]> {
    const deliverymans = await this.prisma.user.findMany({
      where: {
        role: 'DELIVERYMAN',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return deliverymans.map((deliveryman) =>
      PrismaDeliverymanMapper.toDomain(deliveryman),
    )
  }

  async create(deliveryman: Deliveryman): Promise<void> {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)

    await this.prisma.user.create({
      data,
    })
  }

  async save(deliveryman: Deliveryman): Promise<void> {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(deliveryman: Deliveryman): Promise<void> {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)

    await this.prisma.user.delete({
      where: {
        id: data.id,
      },
    })
  }
}
