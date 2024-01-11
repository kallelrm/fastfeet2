import { FetchDeliverymansUseCase } from './fetch-deliverymans'
import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { makeAdministrator } from 'test/factories/make-administrator'
import { makeDeliveryman } from 'test/factories/make-deliveryman'

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository
let sut: FetchDeliverymansUseCase

describe('Fetch Deliverymans Use Case', () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()
    sut = new FetchDeliverymansUseCase(
      inMemoryAdministratorsRepository,
      inMemoryDeliverymansRepository,
    )
  })

  it('should be able to fetch deliverymans', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    await inMemoryDeliverymansRepository.create(makeDeliveryman())
    await inMemoryDeliverymansRepository.create(makeDeliveryman())
    await inMemoryDeliverymansRepository.create(makeDeliveryman())

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      page: 1,
    })

    if (result.isSuccess()) {
      expect(result.value.deliverymans).toHaveLength(3)
    }
  })

  it('should be able to fetch paginated deliverymans', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    for (let i = 1; i <= 22; i++) {
      await inMemoryDeliverymansRepository.create(makeDeliveryman())
    }

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      page: 2,
    })

    if (result.isSuccess()) {
      expect(result.value.deliverymans).toHaveLength(2)
    }
  })

  it('should not be able to fetch paginated deliverymans without administrator id', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryDeliverymansRepository.create(makeDeliveryman())
    }

    const result = await sut.execute({
      adminId: 'non-existing',
      page: 2,
    })

    expect(result.isSuccess()).toBe(false)
  })
})
