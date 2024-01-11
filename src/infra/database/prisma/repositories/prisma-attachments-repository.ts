import { AttachmentsRepository } from '@/domain/logistic/application/repositories/attachments-repository'
import { Attachment } from '@/domain/logistic/enterprise/entities/attachment'
import { PrismaService } from '../prisma.service'
import { PrismaAttachmentsMapper } from '../mappers/prisma-attachment-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentsMapper.toPrisma(attachment)

    await this.prisma.attachment.create({
      data,
    })
  }
}
