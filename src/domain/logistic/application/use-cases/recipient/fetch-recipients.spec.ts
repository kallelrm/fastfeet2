import { FetchRecipientsUseCase } from './fetch-recipients'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { makeAdministrator } from 'test/factories/make-administrator'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository
let sut: FetchRecipientsUseCase

describe('Fetch Recipients Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()
    sut = new FetchRecipientsUseCase(
      inMemoryAdministratorsRepository,
      inMemoryRecipientsRepository,
    )
  })

  it('should be able to fetch recipients', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    await inMemoryRecipientsRepository.create(makeRecipient())
    await inMemoryRecipientsRepository.create(makeRecipient())
    await inMemoryRecipientsRepository.create(makeRecipient())

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      page: 1,
    })

    if (result.isSuccess()) {
      expect(result.value.recipients).toHaveLength(3)
    }
  })

  it('should be able to fetch paginated recipients', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    for (let i = 1; i <= 22; i++) {
      await inMemoryRecipientsRepository.create(makeRecipient())
    }

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      page: 2,
    })

    if (result.isSuccess()) {
      expect(result.value.recipients).toHaveLength(2)
    }
  })

  it('should not be able to fetch paginated recipients without administrator id', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryRecipientsRepository.create(makeRecipient())
    }

    const result = await sut.execute({
      adminId: 'non-existing',
      page: 2,
    })

    expect(result.isSuccess()).toBe(false)
  })
})
