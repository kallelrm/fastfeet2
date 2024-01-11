import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { OrderFactory } from 'test/factories/make-order'
import { DatabaseModule } from '@/infra/database/database.module'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { RecipientFactory } from 'test/factories/make-recipient'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { CacheModule } from '@/infra/cache/cache.module'
import { OrdersRepository } from '@/domain/logistic/application/repositories/orders-repository'

describe('Prisma Orders Repository (E2E)', () => {
  let app: INestApplication
  let orderFactory: OrderFactory
  let recipientFactory: RecipientFactory
  let cacheRepository: CacheRepository
  let ordersRepository: OrdersRepository
  let deliverymanFactory: DeliverymanFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        OrderFactory,
        AdministratorFactory,
        DeliverymanFactory,
        RecipientFactory,
        DeliverymanFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    orderFactory = moduleRef.get(OrderFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    cacheRepository = moduleRef.get(CacheRepository)
    ordersRepository = moduleRef.get(OrdersRepository)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)

    await app.init()
  })

  it('should cache order details', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()
    const deliverymanId = deliveryman.id

    const recipient = await recipientFactory.makePrismaRecipient()
    const recipientId = recipient.id

    const order = await orderFactory.makePrismaOrder({
      deliverymanId,
      recipientId,
      status: 'Pedido-01',
      name: 'Pedido-01',
    })

    const orderId = order.id.toString()

    const orderDetails = await ordersRepository.findById(orderId)

    const cached = await cacheRepository.get(`order:${orderId}:details`)

    expect(cached).toEqual(JSON.stringify(orderDetails))
  })

  it('should return cached order details on subsequent calls', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()
    const deliverymanId = deliveryman.id

    const recipient = await recipientFactory.makePrismaRecipient()
    const recipientId = recipient.id

    const order = await orderFactory.makePrismaOrder({
      deliverymanId,
      recipientId,
      status: 'Pedido-01',
      name: 'Pedido-01',
    })

    const orderId = order.id.toString()

    await cacheRepository.set(
      `order:${orderId}:details`,
      JSON.stringify({ empty: true }),
    )

    const orderDetails = await ordersRepository.findById(orderId)

    expect(orderDetails).toEqual({ empty: true })
  })

  it('should reset order details cache when saving the order', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()
    const deliverymanId = deliveryman.id

    const recipient = await recipientFactory.makePrismaRecipient()
    const recipientId = recipient.id

    const order = await orderFactory.makePrismaOrder({
      deliverymanId,
      recipientId,
      status: 'Pedido-01',
      name: 'Pedido-01',
    })

    const orderId = order.id.toString()

    await cacheRepository.set(
      `order:${orderId}:details`,
      JSON.stringify({ empty: true }),
    )

    await ordersRepository.save(order)

    const cached = await cacheRepository.get(`order:${orderId}:details`)

    expect(cached).toBeNull()
  })
})
