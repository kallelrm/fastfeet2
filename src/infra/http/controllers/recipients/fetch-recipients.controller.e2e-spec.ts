import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Fetch Recipient (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let administratorFactory: AdministratorFactory
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdministratorFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)

    administratorFactory = moduleRef.get(AdministratorFactory)
    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  test('[GET] /recipients', async () => {
    const administrator = await administratorFactory.makePrismaAdministrator()
    const accessToken = jwt.sign({ sub: administrator.id.toString() })

    await Promise.all([
      recipientFactory.makePrismaRecipient({
        name: 'recipient-01',
      }),
      recipientFactory.makePrismaRecipient({
        name: 'recipient-02',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      recipients: expect.arrayContaining([
        expect.objectContaining({ name: 'recipient-01' }),
        expect.objectContaining({ name: 'recipient-02' }),
      ]),
    })
  })
})
