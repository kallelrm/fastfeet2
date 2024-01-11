import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { FetchOrdersDeliverymansUseCase } from './fetch-orders-deliverymans'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeOrder } from 'test/factories/make-order'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InMemoryOrderAttachmentRepository } from 'test/repositories/in-memory-order-attachment-repository'

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository
let sut: FetchOrdersDeliverymansUseCase

describe('Fetch Orders Deliverymans', () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentRepository,
      inMemoryRecipientsRepository,
    )
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()

    sut = new FetchOrdersDeliverymansUseCase(
      inMemoryDeliverymansRepository,
      inMemoryOrdersRepository,
    )
  })

  it('should be able to fetch orders from deliveryman', async () => {
    const deliveryman01 = makeDeliveryman()
    const deliveryman02 = makeDeliveryman()
    inMemoryDeliverymansRepository.items.push(deliveryman01, deliveryman02)

    const recipient01 = makeRecipient()
    const recipient02 = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient01, recipient02)

    const order01 = makeOrder({
      deliverymanId: deliveryman01.id,
      recipientId: recipient01.id,
    })
    const order02 = makeOrder({
      deliverymanId: deliveryman01.id,
      recipientId: recipient02.id,
    })
    inMemoryOrdersRepository.items.push(order01, order02)

    const result = await sut.execute({
      deliverymanId: deliveryman01.id.toString(),
      page: 1,
    })

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.orders).toHaveLength(2)
    }
  })

  it('should be able to fetch orders from another deliveryman', async () => {
    const deliveryman01 = makeDeliveryman()
    const deliveryman02 = makeDeliveryman()
    inMemoryDeliverymansRepository.items.push(deliveryman01, deliveryman02)

    const recipient01 = makeRecipient()
    const recipient02 = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient01, recipient02)

    const order01 = makeOrder({
      deliverymanId: deliveryman01.id,
      recipientId: recipient01.id,
    })
    const order02 = makeOrder({
      deliverymanId: deliveryman01.id,
      recipientId: recipient02.id,
    })
    const order03 = makeOrder({
      deliverymanId: deliveryman02.id,
      recipientId: recipient02.id,
    })
    const order04 = makeOrder({
      deliverymanId: deliveryman02.id,
      recipientId: recipient02.id,
    })
    const order05 = makeOrder({
      deliverymanId: deliveryman02.id,
      recipientId: recipient01.id,
    })
    inMemoryOrdersRepository.items.push(
      order01,
      order02,
      order03,
      order04,
      order05,
    )

    const result = await sut.execute({
      deliverymanId: deliveryman02.id.toString(),
      page: 1,
    })

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.orders).toHaveLength(3)
    }
  })

  it('should not be able to fetch orders from deliveryman that not exists', async () => {
    const deliveryman01 = makeDeliveryman()
    const deliveryman02 = makeDeliveryman()
    inMemoryDeliverymansRepository.items.push(deliveryman01, deliveryman02)

    const recipient01 = makeRecipient()
    const recipient02 = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient01, recipient02)

    const order01 = makeOrder({
      deliverymanId: deliveryman01.id,
      recipientId: recipient01.id,
    })
    const order02 = makeOrder({
      deliverymanId: deliveryman01.id,
      recipientId: recipient02.id,
    })
    inMemoryOrdersRepository.items.push(order01, order02)

    const result = await sut.execute({
      deliverymanId: 'nonexistent',
      page: 1,
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to fetch paginated orders from deliveryman', async () => {
    const deliveryman = makeDeliveryman()
    inMemoryDeliverymansRepository.items.push(deliveryman)

    const recipient = makeRecipient()
    inMemoryRecipientsRepository.items.push(recipient)

    for (let i = 1; i <= 22; i++) {
      const order = makeOrder({
        deliverymanId: deliveryman.id,
        recipientId: recipient.id,
      })

      inMemoryOrdersRepository.items.push(order)
    }

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      page: 2,
    })

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.orders).toHaveLength(2)
    }
  })
})
