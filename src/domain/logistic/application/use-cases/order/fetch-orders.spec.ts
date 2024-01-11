import { FetchOrdersUseCase } from './fetch-orders'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { makeAdministrator } from 'test/factories/make-administrator'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrderAttachmentRepository } from 'test/repositories/in-memory-order-attachment-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let sut: FetchOrdersUseCase

describe('Fetch Orders Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentRepository,
      inMemoryRecipientsRepository,
    )
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()
    sut = new FetchOrdersUseCase(
      inMemoryAdministratorsRepository,
      inMemoryOrdersRepository,
    )
  })

  it('should be able to fetch orders', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    await inMemoryOrdersRepository.create(makeOrder())
    await inMemoryOrdersRepository.create(makeOrder())
    await inMemoryOrdersRepository.create(makeOrder())

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      page: 1,
    })

    if (result.isSuccess()) {
      expect(result.value.orders).toHaveLength(3)
    }
  })

  it('should be able to fetch paginated orders', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    for (let i = 1; i <= 22; i++) {
      await inMemoryOrdersRepository.create(makeOrder())
    }

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      page: 2,
    })

    if (result.isSuccess()) {
      expect(result.value.orders).toHaveLength(2)
    }
  })

  it('should not be able to fetch paginated orders without administrator id', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryOrdersRepository.create(makeOrder())
    }

    const result = await sut.execute({
      adminId: 'non-existing',
      page: 2,
    })

    expect(result.isSuccess()).toBe(false)
  })
})
