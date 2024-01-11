import { OrderAttachmentRepository } from '@/domain/logistic/application/repositories/order-attachment-repository'
import { OrderAttachment } from '@/domain/logistic/enterprise/entities/order-attachment'
import { PrismaService } from '../prisma.service'
import { PrismaOrderAttachmentMapper } from '../mappers/prisma-order-attachment-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaOrderAttachmentRepository
  implements OrderAttachmentRepository
{
  constructor(private prisma: PrismaService) {}

  async create(attachment: OrderAttachment): Promise<void> {
    const data = PrismaOrderAttachmentMapper.toPrisma(attachment)

    await this.prisma.attachment.update(data)
  }

  async delete(attachment: OrderAttachment): Promise<void> {
    await this.prisma.attachment.delete({
      where: {
        id: attachment.id.toString(),
      },
    })
  }

  async findByOrderId(orderId: string): Promise<OrderAttachment | null> {
    const orderAttachment = await this.prisma.attachment.findFirst({
      where: {
        orderId,
      },
    })

    if (!orderAttachment) {
      return null
    }

    return PrismaOrderAttachmentMapper.toDomain(orderAttachment)
  }

  async deleteByOrderId(orderId: string): Promise<void> {
    await this.prisma.attachment.delete({
      where: {
        orderId,
      },
    })
  }
}
