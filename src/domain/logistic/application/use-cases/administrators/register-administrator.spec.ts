import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { RegisterAdministratorUseCase } from './register-administrator'

let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository
let fakeHasher: FakeHasher
let sut: RegisterAdministratorUseCase

describe('Register Administrator Use Case', () => {
  beforeEach(() => {
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterAdministratorUseCase(
      inMemoryAdministratorsRepository,
      fakeHasher,
    )
  })

  it('should be able to register a new administrator', async () => {
    const result = await sut.execute({
      name: 'John',
      lastname: 'Doe',
      cpf: '123456',
      phone: '123456',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      administrator: inMemoryAdministratorsRepository.items[0],
    })
  })

  it('should hash administrator password upon registration', async () => {
    const result = await sut.execute({
      name: 'John',
      lastname: 'Doe',
      cpf: '123456',
      phone: '123456',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryAdministratorsRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })

  it('should not be able to register with same cpf twice', async () => {
    const cpf = '123456'

    await sut.execute({
      name: 'John',
      lastname: 'Doe',
      cpf,
      phone: '123456',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const result = await sut.execute({
      name: 'John',
      lastname: 'Doe',
      cpf,
      phone: '123456',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    expect(result.isError()).toBe(true)
  })
})
