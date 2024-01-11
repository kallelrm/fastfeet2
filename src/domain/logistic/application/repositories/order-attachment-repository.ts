import { OrderAttachment } from '../../enterprise/entities/order-attachment'

export abstract class OrderAttachmentRepository {
  abstract create(attachment: OrderAttachment): Promise<void>
  abstract delete(attachment: OrderAttachment): Promise<void>
  abstract findByOrderId(orderId: string): Promise<OrderAttachment | null>
  abstract deleteByOrderId(orderId: string): Promise<void>
}
