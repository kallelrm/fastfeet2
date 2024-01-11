import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { CreateOrderUseCase } from './create-order'

import { makeRecipient } from 'test/factories/make-recipient'
import { makeAdministrator } from 'test/factories/make-administrator'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InMemoryOrderAttachmentRepository } from 'test/repositories/in-memory-order-attachment-repository'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository
let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository
let sut: CreateOrderUseCase

describe('Create Order Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentRepository,
      inMemoryRecipientsRepository,
    )
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()
    sut = new CreateOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryAdministratorsRepository,
      inMemoryDeliverymansRepository,
      inMemoryRecipientsRepository,
    )
  })

  it('should be able to create a new order', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      deliverymanId: deliveryman.id.toString(),
      recipientId: recipient.id.toString(),
      name: 'Pacote 1',
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      order: inMemoryOrdersRepository.items[0],
    })
  })

  it('should not be able to create with non existing adminstrator', async () => {
    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      adminId: 'non-existing-admin',
      deliverymanId: deliveryman.id.toString(),
      recipientId: recipient.id.toString(),
      name: 'Pacote 1',
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to create with non existing deliveryman', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      deliverymanId: 'non-existent',
      recipientId: recipient.id.toString(),
      name: 'Pacote 1',
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create with non existing recipient', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      deliverymanId: deliveryman.id.toString(),
      recipientId: 'non-existing',
      name: 'Pacote 1',
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
