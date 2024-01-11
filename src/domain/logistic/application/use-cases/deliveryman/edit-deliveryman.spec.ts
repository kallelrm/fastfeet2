import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { EditDeliverymanUseCase } from './edit-deliveryman'
import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { makeAdministrator } from 'test/factories/make-administrator'

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository

let sut: EditDeliverymanUseCase

describe('Edit Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()

    sut = new EditDeliverymanUseCase(
      inMemoryAdministratorsRepository,
      inMemoryDeliverymansRepository,
    )
  })

  it('should be able to edit an existing deliveryman', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    const deliveryman = makeDeliveryman({
      cpf: '132456',
      name: 'John',
      lastname: 'Doe',
      phone: '123456',
      password: '123456',
    })

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      deliverymanId: deliveryman.id.toString(),
      email: 'alovcteste@gmail.com',
      cpf: '123456789',
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryDeliverymansRepository.items[0]).toMatchObject({
      cpf: '123456789',
      email: 'alovcteste@gmail.com',
    })
  })
})
