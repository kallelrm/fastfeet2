import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { hash } from 'bcryptjs'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Authenticate Administrator (E2E)', () => {
  let app: INestApplication
  let administratorFactory: AdministratorFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdministratorFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    administratorFactory = moduleRef.get(AdministratorFactory)

    await app.init()
  })

  test('[POST] /sessions/admin', async () => {
    await administratorFactory.makePrismaAdministrator({
      cpf: '12345678998',
      password: await hash('123456', 8),
    })

    const result = await request(app.getHttpServer())
      .post('/sessions/admin')
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
