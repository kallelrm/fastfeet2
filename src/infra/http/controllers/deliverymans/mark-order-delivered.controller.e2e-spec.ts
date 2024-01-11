import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Mark Order Delivered (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let attachmentFactory: AttachmentFactory
  let recipientFactory: RecipientFactory
  let deliverymanFactory: DeliverymanFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AttachmentFactory,
        RecipientFactory,
        DeliverymanFactory,
        OrderFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    attachmentFactory = moduleRef.get(AttachmentFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  test('[POST] /orders/:orderId/delivered', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()
    const accessToken = jwt.sign({ sub: deliveryman.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaOrder({
      deliverymanId: deliveryman.id,
      recipientId: recipient.id,
    })

    const attachment = await attachmentFactory.makePrismaAttachment()
    const attachmentId = attachment.id.toString()

    const orderId = order.id.toString()

    const result = await request(app.getHttpServer())
      .post(`/orders/${orderId}/delivered`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        attachmentId,
      })

    expect(result.statusCode).toBe(204)

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    })

    expect(orderOnDatabase).toBeTruthy()
    expect(orderOnDatabase?.status).toEqual('Entregue')

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        orderId: orderOnDatabase?.id,
      },
    })

    expect(attachmentsOnDatabase).toHaveLength(1)
  })
})
