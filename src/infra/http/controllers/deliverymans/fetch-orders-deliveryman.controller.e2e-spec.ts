import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Fetch Orders Deliverymans (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let recipientFactory: RecipientFactory
  let deliverymanFactory: DeliverymanFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, DeliverymanFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    recipientFactory = moduleRef.get(RecipientFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  test('[POST] /orders/deliverymans', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()
    const accessToken = jwt.sign({ sub: deliveryman.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    await Promise.all([
      orderFactory.makePrismaOrder({
        deliverymanId: deliveryman.id,
        recipientId: recipient.id,
        name: 'package-01',
      }),
      orderFactory.makePrismaOrder({
        deliverymanId: deliveryman.id,
        recipientId: recipient.id,
        name: 'package-02',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/orders/deliverymans')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      orders: expect.arrayContaining([
        expect.objectContaining({ name: 'package-01' }),
        expect.objectContaining({ name: 'package-02' }),
      ]),
    })
  })
})
