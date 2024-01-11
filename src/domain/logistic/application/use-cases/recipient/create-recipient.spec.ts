import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { makeAdministrator } from 'test/factories/make-administrator'
import { CreateRecipientUseCase } from './create-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository
let sut: CreateRecipientUseCase

describe('Create Recipient Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()
    sut = new CreateRecipientUseCase(
      inMemoryAdministratorsRepository,
      inMemoryRecipientsRepository,
    )
  })

  it('should be able to create a new recipient', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      name: 'John',
      email: 'johndoe@gmail.com',
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
    expect(result.value).toEqual({
      recipient: inMemoryRecipientsRepository.items[0],
    })
  })

  it('should not be able to create with same email twice', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    const email = 'example@gmail.com'

    await sut.execute({
      adminId: administrator.id.toString(),
      name: 'John',
      email,
      phone: '123456',
      street: 'Rua do teste',
      number: '123AD',
      city: 'CWB',
      state: 'PR',
      zipcode: '12345678',
      latitude: 123457.8,
      longitude: 45678.8,
    })

    const result = await sut.execute({
      adminId: 'non-existing',
      name: 'John',
      email,
      phone: '123456',
      street: 'Rua do teste',
      number: '123AD',
      city: 'CWB',
      state: 'PR',
      zipcode: '12345678',
      latitude: 123457.8,
      longitude: 45678.8,
    })

    expect(result.isError()).toBe(true)
  })

  it('should not be able to create with non existing admnistrator', async () => {
    const result = await sut.execute({
      adminId: 'non-existing',
      name: 'John',
      email: 'johndoe@gmail.com',
      phone: '123456',
      street: 'Rua do teste',
      number: '123AD',
      city: 'CWB',
      state: 'PR',
      zipcode: '12345678',
      latitude: 123457.8,
      longitude: 45678.8,
    })

    expect(result.isError()).toBe(true)
  })
})
