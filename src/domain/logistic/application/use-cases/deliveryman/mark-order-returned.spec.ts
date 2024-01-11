import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { makeOrder } from 'test/factories/make-order'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { MarkOrderReturnedUseCase } from './mark-order-returned'
import { InMemoryOrderAttachmentRepository } from 'test/repositories/in-memory-order-attachment-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: MarkOrderReturnedUseCase

describe('Mark order returned', () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentRepository,
      inMemoryRecipientsRepository,
    )

    sut = new MarkOrderReturnedUseCase(
      inMemoryDeliverymansRepository,
      inMemoryOrdersRepository,
    )
  })

  it('should be able to mark an order as returned', async () => {
    const deliveryman = makeDeliveryman()
    inMemoryDeliverymansRepository.items.push(deliveryman)

    const order = makeOrder({
      deliverymanId: deliveryman.id,
    })
    inMemoryOrdersRepository.items.push(order)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      orderId: order.id.toString(),
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryOrdersRepository.items[0].returnedAt).not.toBeNull()
    expect(inMemoryOrdersRepository.items[0].status).toBe('D')
  })

  it('should not be able to mark an order as returned without authorization', async () => {
    const order = makeOrder()
    inMemoryOrdersRepository.items.push(order)

    const result = await sut.execute({
      deliverymanId: 'notexistent',
      orderId: order.id.toString(),
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to mark an order as returned without order id', async () => {
    const deliveryman = makeDeliveryman()
    inMemoryDeliverymansRepository.items.push(deliveryman)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      orderId: 'notexistent',
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to mark an order as returned if the delivery person is not the same person who picked it up', async () => {
    const deliveryman01 = makeDeliveryman()
    const deliveryman02 = makeDeliveryman()
    inMemoryDeliverymansRepository.items.push(deliveryman01, deliveryman02)

    const order = makeOrder({
      deliverymanId: deliveryman01.id,
    })
    inMemoryOrdersRepository.items.push(order)

    const result = await sut.execute({
      deliverymanId: deliveryman02.id.toString(),
      orderId: order.id.toString(),
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
