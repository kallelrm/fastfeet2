import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { DeleteRecipientUseCase } from './delete-recipient'
import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { makeAdministrator } from 'test/factories/make-administrator'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository

let sut: DeleteRecipientUseCase

describe('Delete Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()

    sut = new DeleteRecipientUseCase(
      inMemoryAdministratorsRepository,
      inMemoryRecipientsRepository,
    )
  })

  it('should be able to delete an existing recipient', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      recipientId: recipient.id.toString(),
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryRecipientsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an existing recipient with non existing administrador', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      adminId: 'non-existing',
      recipientId: recipient.id.toString(),
    })

    expect(result.isError()).toBe(true)
    expect(inMemoryRecipientsRepository.items).toHaveLength(1)
  })
})
