import { AttachmentsRepository } from '@/domain/logistic/application/repositories/attachments-repository'
import { Attachment } from '@/domain/logistic/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment) {
    this.items.push(attachment)
  }
}
