import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderAttachment } from '@/domain/logistic/enterprise/entities/order-attachment'
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaOrderAttachmentMapper {
  static toDomain(raw: PrismaAttachment): OrderAttachment {
    if (!raw.orderId) {
      throw new Error('Invalid attachment type.')
    }

    return OrderAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        orderId: new UniqueEntityID(raw.orderId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(raw: OrderAttachment): Prisma.AttachmentUpdateArgs {
    const data = {
      where: {
        id: raw.attachmentId.toString(),
      },
      data: {
        orderId: raw.orderId.toString(),
      },
    }

    return data
  }
}
