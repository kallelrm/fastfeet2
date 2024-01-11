import { Module } from '@nestjs/common'
import { CacheModule } from '../cache/cache.module'
import { PrismaService } from './prisma/prisma.service'

import { PrismaAdministratorsRepository } from './prisma/repositories/prisma-administrators-repository'
import { AdministratorsRepository } from '@/domain/logistic/application/repositories/administrators-repository'
import { DeliverymansRepository } from '@/domain/logistic/application/repositories/deliverymans-repository'
import { PrismaDeliverymansRepository } from './prisma/repositories/prisma-deliverymans-repository'
import { OrdersRepository } from '@/domain/logistic/application/repositories/orders-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'
import { RecipientsRepository } from '@/domain/logistic/application/repositories/recipients-repository'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'
import { AttachmentsRepository } from '@/domain/logistic/application/repositories/attachments-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'
import { OrderAttachmentRepository } from '@/domain/logistic/application/repositories/order-attachment-repository'
import { PrismaOrderAttachmentRepository } from './prisma/repositories/prisma-order-attachment-repository'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: AdministratorsRepository,
      useClass: PrismaAdministratorsRepository,
    },
    {
      provide: DeliverymansRepository,
      useClass: PrismaDeliverymansRepository,
    },
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: OrderAttachmentRepository,
      useClass: PrismaOrderAttachmentRepository,
    },
  ],
  exports: [
    PrismaService,
    AdministratorsRepository,
    DeliverymansRepository,
    OrdersRepository,
    RecipientsRepository,
    NotificationsRepository,
    AttachmentsRepository,
    OrderAttachmentRepository,
  ],
})
export class DatabaseModule {}
