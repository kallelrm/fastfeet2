import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { OrderAvailableForPickupUseCase } from './order-available-for-pickup'
import { makeAdministrator } from 'test/factories/make-administrator'
import { makeOrder } from 'test/factories/make-order'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InMemoryOrderAttachmentRepository } from 'test/repositories/in-memory-order-attachment-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'

let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository

let sut: OrderAvailableForPickupUseCase

describe('Mark Order Waiting', () => {
  beforeEach(() => {
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentRepository,
      inMemoryRecipientsRepository,
    )

    sut = new OrderAvailableForPickupUseCase(
      inMemoryAdministratorsRepository,
      inMemoryOrdersRepository,
    )
  })

  it('should be able to mark an order as waiting', async () => {
    const administrator = makeAdministrator()
    inMemoryAdministratorsRepository.items.push(administrator)

    const order = makeOrder()
    inMemoryOrdersRepository.items.push(order)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      orderId: order.id.toString(),
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryOrdersRepository.items[0].postedAt).not.toBeNull()
    expect(inMemoryOrdersRepository.items[0].status).toBe('A')
  })

  it('should not be able to mark an order as waiting without authorization', async () => {
    const order = makeOrder()
    inMemoryOrdersRepository.items.push(order)

    const result = await sut.execute({
      adminId: 'notexistent',
      orderId: order.id.toString(),
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to mark an order as waiting without order id', async () => {
    const administrator = makeAdministrator()
    inMemoryAdministratorsRepository.items.push(administrator)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      orderId: 'notexistent',
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
