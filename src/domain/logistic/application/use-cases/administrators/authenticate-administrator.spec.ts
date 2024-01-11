import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { AuthenticateAdministratorUseCase } from './authenticate-administrator'
import { makeAdministrator } from 'test/factories/make-administrator'

let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateAdministratorUseCase

describe('Authenticate Administrator', () => {
  beforeEach(() => {
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateAdministratorUseCase(
      inMemoryAdministratorsRepository,
      fakeHasher,
      encrypter,
    )
  })

  it('should be able to authenticate a administrator', async () => {
    const administrator = makeAdministrator({
      cpf: '123456',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryAdministratorsRepository.items.push(administrator)

    const result = await sut.execute({
      cpf: '123456',
      password: '123456',
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
