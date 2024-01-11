import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { makeAdministrator } from 'test/factories/make-administrator'
import { ChangePasswordDeliverymanUseCase } from './change-password-deliveryman'

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository
let fakeHasher: FakeHasher

let sut: ChangePasswordDeliverymanUseCase

describe('Change Password Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()
    fakeHasher = new FakeHasher()

    sut = new ChangePasswordDeliverymanUseCase(
      inMemoryAdministratorsRepository,
      inMemoryDeliverymansRepository,
      fakeHasher,
    )
  })

  it('should be able to change a password of an existing deliveryman', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      deliverymanId: deliveryman.id.toString(),
      password: '123456789',
      confirmPassword: '123456789',
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryDeliverymansRepository.items[0]).toMatchObject({
      password: '123456789-hashed',
    })
  })

  it('should not be able to change a password with wrong confirm password', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      deliverymanId: deliveryman.id.toString(),
      password: '123456789',
      confirmPassword: '1234567890',
    })

    expect(result.isSuccess()).toBe(false)
  })

  it('should not be able to change a password with no authorization', async () => {
    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const result = await sut.execute({
      adminId: 'non-existing',
      deliverymanId: deliveryman.id.toString(),
      password: '123456789',
      confirmPassword: '1234567890',
    })

    expect(result.isSuccess()).toBe(false)
  })
})
