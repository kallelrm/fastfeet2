import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'

@Controller('/notifications/:notificationId/:recipientId/read')
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('notificationId') notificationId: string,
    @Param('recipientId') recipientId: string,
  ) {
    const result = await this.readNotification.execute({
      recipientId,
      notificationId,
    })

    if (result.isError()) {
      throw new BadRequestException()
    }
  }
}
