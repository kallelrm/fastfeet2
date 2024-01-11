import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Edit Order (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let administratorFactory: AdministratorFactory
  let recipientFactory: RecipientFactory
  let deliverymanFactory: DeliverymanFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AdministratorFactory,
        RecipientFactory,
        DeliverymanFactory,
        OrderFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    administratorFactory = moduleRef.get(AdministratorFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  test('[PUT] /orders', async () => {
    const administrator = await administratorFactory.makePrismaAdministrator()
    const accessToken = jwt.sign({ sub: administrator.id.toString() })

    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()
    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaOrder({
      deliverymanId: deliveryman.id,
      recipientId: recipient.id,
    })

    const deliveryman02 = await deliverymanFactory.makePrismaDeliveryman()

    const result = await request(app.getHttpServer())
      .put('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'package-02',
        orderId: order.id.toString(),
        recipientId: recipient.id.toString(),
        deliverymanId: deliveryman02.id.toString(),
      })

    expect(result.statusCode).toBe(204)

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        name: 'package-02',
      },
    })

    expect(orderOnDatabase).toBeTruthy()
    expect(orderOnDatabase?.userId).toEqual(deliveryman02.id.toString())
  })
})
