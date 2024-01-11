import { EditOrderUseCase } from './edit-order'

import { makeOrder } from 'test/factories/make-order'
import { makeAdministrator } from 'test/factories/make-administrator'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { makeRecipient } from 'test/factories/make-recipient'

import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryAdministratorsRepository } from 'test/repositories/in-memory-administrators-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InMemoryOrderAttachmentRepository } from 'test/repositories/in-memory-order-attachment-repository'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository
let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository

let sut: EditOrderUseCase

describe('Edit Order', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderAttachmentRepository,
      inMemoryRecipientsRepository,
    )
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()

    sut = new EditOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryAdministratorsRepository,
      inMemoryDeliverymansRepository,
      inMemoryRecipientsRepository,
    )
  })

  it('should be able to edit an existing order', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)

    const order = makeOrder()

    inMemoryOrdersRepository.items.push(order)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      orderId: order.id.toString(),
      deliverymanId: deliveryman.id.toString(),
      recipientId: recipient.id.toString(),
      name: 'Pacote edição',
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryOrdersRepository.items[0]).toMatchObject({
      name: 'Pacote edição',
    })
  })

  it('should not be able to edit an existing order without non existing admin', async () => {
    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)

    const order = makeOrder()

    inMemoryOrdersRepository.items.push(order)

    const result = await sut.execute({
      adminId: 'non-existing',
      orderId: order.id.toString(),
      deliverymanId: deliveryman.id.toString(),
      recipientId: recipient.id.toString(),
      name: 'Pacote edição',
    })

    expect(result.isSuccess()).toBe(false)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to edit an existing order without non existing order', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      orderId: 'non-existing',
      deliverymanId: deliveryman.id.toString(),
      recipientId: recipient.id.toString(),
      name: 'Pacote edição',
    })

    expect(result.isSuccess()).toBe(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit an existing order without non existing deliveryman', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    const recipient = makeRecipient()

    inMemoryRecipientsRepository.items.push(recipient)

    const order = makeOrder()

    inMemoryOrdersRepository.items.push(order)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      orderId: order.id.toString(),
      deliverymanId: 'non-existing',
      recipientId: recipient.id.toString(),
      name: 'Pacote edição',
    })

    expect(result.isSuccess()).toBe(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit an existing order without non existing recipient', async () => {
    const administrator = makeAdministrator()

    inMemoryAdministratorsRepository.items.push(administrator)

    const deliveryman = makeDeliveryman()

    inMemoryDeliverymansRepository.items.push(deliveryman)

    const order = makeOrder()

    inMemoryOrdersRepository.items.push(order)

    const result = await sut.execute({
      adminId: administrator.id.toString(),
      orderId: order.id.toString(),
      deliverymanId: deliveryman.id.toString(),
      recipientId: 'non-existing',
      name: 'Pacote edição',
    })

    expect(result.isSuccess()).toBe(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
