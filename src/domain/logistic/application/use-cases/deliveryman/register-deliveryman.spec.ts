import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { RegisterDeliverymanUseCase } from './register-deliveryman'
import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { makeAdministrator } from 'test/factories/make-administrator'

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository
let fakeHasher: FakeHasher
let sut: RegisterDeliverymanUseCase

describe('Register Deliveryman Use Case', () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterDeliverymanUseCase(
      inMemoryAdministratorsRepository,
      inMemoryDeliverymansRepository,
      fakeHasher,
    )
  })

  it('should be able to register a new deliveryman', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      name: 'John',
      lastname: 'Doe',
      cpf: '123456',
      phone: '123456',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      deliveryman: inMemoryDeliverymansRepository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      name: 'John',
      lastname: 'Doe',
      cpf: '123456',
      phone: '123456',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryDeliverymansRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })

  it('should not be able to register with same cpf twice', async () => {
    const cpf = '123456'

    await sut.execute({
      adminId: 'non-existing',
      name: 'John',
      lastname: 'Doe',
      cpf,
      phone: '123456',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const result = await sut.execute({
      adminId: 'non-existing',
      name: 'John',
      lastname: 'Doe',
      cpf,
      phone: '123456',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    expect(result.isError()).toBe(true)
  })

  it('should not be able to register with non existing admnistrator', async () => {
    const result = await sut.execute({
      adminId: 'non-existing',
      name: 'John',
      lastname: 'Doe',
      cpf: '123456',
      phone: '123456',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    expect(result.isError()).toBe(true)
  })
})
