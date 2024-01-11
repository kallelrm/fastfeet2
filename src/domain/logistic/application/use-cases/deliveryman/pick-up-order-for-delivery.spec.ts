import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { PickUpOrderForDeliveryUseCase } from './pick-up-order-for-delivery'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { makeOrder } from 'test/factories/make-order'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InMemoryOrderAttachmentRepository } from 'test/repositories/in-memory-order-attachment-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: PickUpOrderForDeliveryUseCase

describe('Pick up order', () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentRepository,
      inMemoryRecipientsRepository,
    )

    sut = new PickUpOrderForDeliveryUseCase(
      inMemoryDeliverymansRepository,
      inMemoryOrdersRepository,
    )
  })

  it('should be able to pick up an order', async () => {
    const deliveryman = makeDeliveryman()
    inMemoryDeliverymansRepository.items.push(deliveryman)

    const order = makeOrder()
    inMemoryOrdersRepository.items.push(order)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      orderId: order.id.toString(),
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryOrdersRepository.items[0].retiredAt).not.toBeNull()
    expect(inMemoryOrdersRepository.items[0].deliverymanId).toMatchObject({
      value: deliveryman.id.toString(),
    })
    expect(inMemoryOrdersRepository.items[0].status).toBe('R')
  })

  it('should not be able to mark an order as waiting without authorization', async () => {
    const order = makeOrder()
    inMemoryOrdersRepository.items.push(order)

    const result = await sut.execute({
      deliverymanId: 'notexistent',
      orderId: order.id.toString(),
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to mark an order as waiting without order id', async () => {
    const deliveryman = makeDeliveryman()
    inMemoryDeliverymansRepository.items.push(deliveryman)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      orderId: 'notexistent',
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
