import { OrderAttachmentRepository } from '@/domain/logistic/application/repositories/order-attachment-repository'
import { OrderAttachment } from '@/domain/logistic/enterprise/entities/order-attachment'

export class InMemoryOrderAttachmentRepository
  implements OrderAttachmentRepository
{
  public items: OrderAttachment[] = []

  async findByOrderId(orderId: string | null) {
    const orderAttachment = this.items.find(
      (item) => item.orderId.toString() === orderId,
    )

    if (!orderAttachment) {
      return null
    }

    return orderAttachment
  }

  async create(attachment: OrderAttachment): Promise<void> {
    this.items.push(attachment)
  }

  async delete(attachment: OrderAttachment): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === attachment.id)

    this.items.splice(itemIndex, 1)
  }

  async deleteByOrderId(orderId: string) {
    const orderAttachment = this.items.filter(
      (item) => item.orderId.toString() !== orderId,
    )

    this.items = orderAttachment
  }
}
