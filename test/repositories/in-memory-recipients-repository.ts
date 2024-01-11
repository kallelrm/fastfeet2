import { PaginationParams } from '@/core/repositories/paginations-params'
import { RecipientsRepository } from '@/domain/logistic/application/repositories/recipients-repository'
import { Recipient } from '@/domain/logistic/enterprise/entities/recipient'

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []

  async findById(id: string): Promise<Recipient | null> {
    const recipient = this.items.find((item) => item.id.toString() === id)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findByEmail(email: string): Promise<Recipient | null> {
    const recipient = this.items.find((item) => item.email === email)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findMany({ page }: PaginationParams) {
    const recipients = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return recipients
  }

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient)
  }

  async save(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)

    this.items[itemIndex] = recipient
  }

  async delete(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)

    this.items.splice(itemIndex, 1)
  }
}
