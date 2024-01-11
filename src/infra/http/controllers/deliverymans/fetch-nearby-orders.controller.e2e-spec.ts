import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Fetch Nearby Orders (E2E)', () => {
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

  test('[POST] /orders/nearby', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()
    const accessToken = jwt.sign({ sub: deliveryman.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient({
      latitude: -9.599687,
      longitude: -35.760567,
    })

    const recipient02 = await recipientFactory.makePrismaRecipient({
      latitude: -9.599687,
      longitude: -35.760567,
    })

    await Promise.all([
      orderFactory.makePrismaOrder({
        deliverymanId: deliveryman.id,
        recipientId: recipient.id,
        name: 'package-01',
      }),
      orderFactory.makePrismaOrder({
        deliverymanId: deliveryman.id,
        recipientId: recipient02.id,
        name: 'package-02',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/orders/nearby')
      .query({
        latitude: -9.599687,
        longitude: -35.760567,
      })
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
