import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { SpyInstance } from 'vitest'
import {
  SendNotificationUseCaseRequest,
  SendNotificationUseCase,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { OnChangeStatus } from './on-change-status'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { waitFor } from 'test/utils/wait-for'
import { InMemoryOrderAttachmentRepository } from 'test/repositories/in-memory-order-attachment-repository'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On change status', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentRepository,
      inMemoryRecipientsRepository,
    )

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnChangeStatus(sendNotificationUseCase, inMemoryRecipientsRepository)
  })

  it('should send a notification when the status changes', async () => {
    const recipient = makeRecipient()
    const order = makeOrder({ recipientId: recipient.id })

    inMemoryRecipientsRepository.create(recipient)
    inMemoryOrdersRepository.create(order)

    order.status = 'Entregue'

    inMemoryOrdersRepository.save(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  }, 10000)
})
