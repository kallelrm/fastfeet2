import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryOrderAttachmentRepository } from 'test/repositories/in-memory-order-attachment-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { FetchNearbyOrdersUseCase } from './fetch-nearby-orders'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeOrder } from 'test/factories/make-order'

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository
let sut: FetchNearbyOrdersUseCase

describe('Fetch Nearby Orders', () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentRepository,
      inMemoryRecipientsRepository,
    )

    sut = new FetchNearbyOrdersUseCase(
      inMemoryDeliverymansRepository,
      inMemoryOrdersRepository,
    )
  })

  it('should be able to fetch nearby orders from deliveryman', async () => {
    const deliveryman = makeDeliveryman()
    inMemoryDeliverymansRepository.items.push(deliveryman)

    const recipient01 = makeRecipient({
      latitude: -9.599687,
      longitude: -35.760567,
    })
    const recipient02 = makeRecipient({
      latitude: -9.599687,
      longitude: -35.760567,
    })
    inMemoryRecipientsRepository.items.push(recipient01, recipient02)

    const order01 = makeOrder({
      deliverymanId: deliveryman.id,
      recipientId: recipient01.id,
      name: 'pedido-01',
    })
    const order02 = makeOrder({
      deliverymanId: deliveryman.id,
      recipientId: recipient02.id,
      name: 'pedido-02',
    })
    inMemoryOrdersRepository.items.push(order01, order02)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      userLatitude: -9.600538,
      userLongitude: -35.7608173,
      page: 1,
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      orders: [
        expect.objectContaining({ name: 'pedido-01' }),
        expect.objectContaining({ name: 'pedido-02' }),
      ],
    })
  })
})
