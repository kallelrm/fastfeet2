import { OnChangeStatus } from '@/domain/notification/application/subscribers/on-change-status'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [OnChangeStatus, SendNotificationUseCase],
})
export class EventsModule {}
