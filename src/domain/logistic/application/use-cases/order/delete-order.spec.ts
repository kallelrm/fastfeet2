import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { makeOrder } from 'test/factories/make-order'
import { DeleteOrderUseCase } from './delete-order'
import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { makeAdministrator } from 'test/factories/make-administrator'
import { InMemoryOrderAttachmentRepository } from 'test/repositories/in-memory-order-attachment-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository

let sut: DeleteOrderUseCase

describe('Delete Order', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentRepository,
      inMemoryRecipientsRepository,
    )
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()

    sut = new DeleteOrderUseCase(
      inMemoryAdministratorsRepository,
      inMemoryOrdersRepository,
    )
  })

  it('should be able to delete an existing order', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    const order = makeOrder()

    inMemoryOrdersRepository.items.push(order)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      orderId: order.id.toString(),
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryOrdersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an existing order with non existing administrador', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    const order = makeOrder()

    inMemoryOrdersRepository.items.push(order)

    const result = await sut.execute({
      adminId: 'non-existing',
      orderId: order.id.toString(),
    })

    expect(result.isError()).toBe(true)
    expect(inMemoryOrdersRepository.items).toHaveLength(1)
  })
})
