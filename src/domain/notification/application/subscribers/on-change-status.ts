import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { DomainEvents } from '@/core/events/domain-events'
import { ChangeStatusEvent } from '@/domain/logistic/enterprise/events/change-status-events'
import { RecipientsRepository } from '@/domain/logistic/application/repositories/recipients-repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnChangeStatus implements EventHandler {
  constructor(
    private sendNotification: SendNotificationUseCase,
    private recipientsRepository: RecipientsRepository,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendChangeStatusNotification.bind(this),
      ChangeStatusEvent.name,
    )
  }

  private async sendChangeStatusNotification({
    order,
    status,
  }: ChangeStatusEvent) {
    const recipient = await this.recipientsRepository.findById(
      order.recipientId.toString(),
    )

    if (recipient) {
      await this.sendNotification.execute({
        recipientId: recipient.id.toString(),
        title: 'Status alterado',
        content: `O novo status da encomenda é de "${status}"`,
      })
    }
  }
}
