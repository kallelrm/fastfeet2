import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { hash } from 'bcryptjs'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Authenticate Deliveryman (E2E)', () => {
  let app: INestApplication
  let deliverymanFactory: DeliverymanFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    deliverymanFactory = moduleRef.get(DeliverymanFactory)

    await app.init()
  })

  test('[POST] /sessions/deliveryman', async () => {
    await deliverymanFactory.makePrismaDeliveryman({
      cpf: '12345678998',
      password: await hash('123456', 8),
    })

    const result = await request(app.getHttpServer())
      .post('/sessions/deliveryman')
      .send({
        cpf: '12345678998',
        password: '123456',
      })

    expect(result.statusCode).toBe(201)
    expect(result.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
