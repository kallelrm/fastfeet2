import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { AuthenticateDeliverymanUseCase } from './authenticate-deliveryman'
import { makeDeliveryman } from 'test/factories/make-deliveryman'

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateDeliverymanUseCase

describe('Authenticate Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateDeliverymanUseCase(
      inMemoryDeliverymansRepository,
      fakeHasher,
      encrypter,
    )
  })

  it('should be able to authenticate a deliveryman', async () => {
    const deliveryman = makeDeliveryman({
      cpf: '123456',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryDeliverymansRepository.items.push(deliveryman)

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
