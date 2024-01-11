import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { DeleteDeliverymanUseCase } from './delete-deliveryman'
import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { makeAdministrator } from 'test/factories/make-administrator'

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository

let sut: DeleteDeliverymanUseCase

describe('Delete Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()

    sut = new DeleteDeliverymanUseCase(
      inMemoryAdministratorsRepository,
      inMemoryDeliverymansRepository,
    )
  })

  it('should be able to delete an existing deliveryman', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      deliverymanId: deliveryman.id.toString(),
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryDeliverymansRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an existing deliveryman with non existing administrador', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const result = await sut.execute({
      adminId: 'non-existing',
      deliverymanId: deliveryman.id.toString(),
    })

    expect(result.isError()).toBe(true)
    expect(inMemoryDeliverymansRepository.items).toHaveLength(1)
  })
})
