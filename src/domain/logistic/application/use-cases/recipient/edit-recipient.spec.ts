import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { makeAdministrator } from 'test/factories/make-administrator'
import { EditRecipientUseCase } from './edit-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository

let sut: EditRecipientUseCase

describe('Edit Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()

    sut = new EditRecipientUseCase(
      inMemoryAdministratorsRepository,
      inMemoryRecipientsRepository,
    )
  })

  it('should be able to edit an existing recipient', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      recipientId: recipient.id.toString(),
      name: 'John',
      email: 'alovcteste@gmail.com',
      phone: '123456',
      street: 'Rua do teste',
      number: '123AD',
      city: 'CWB',
      state: 'PR',
      zipcode: '12345678',
      latitude: 123457.8,
      longitude: 45678.8,
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryRecipientsRepository.items[0]).toMatchObject({
      name: 'John',
      email: 'alovcteste@gmail.com',
    })
  })

  it('should not be able to edit an existing recipient without non existing admin', async () => {
    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      adminId: 'non-existing',
      recipientId: recipient.id.toString(),
      name: 'John',
      email: 'alovcteste@gmail.com',
      phone: '123456',
      street: 'Rua do teste',
      number: '123AD',
      city: 'CWB',
      state: 'PR',
      zipcode: '12345678',
      latitude: 123457.8,
      longitude: 45678.8,
    })

    expect(result.isSuccess()).toBe(false)
  })
})
