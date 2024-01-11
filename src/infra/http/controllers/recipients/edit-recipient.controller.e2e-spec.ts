import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Edit Recipient (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let administratorFactory: AdministratorFactory
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdministratorFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    administratorFactory = moduleRef.get(AdministratorFactory)
    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  test('[PUT] /recipients', async () => {
    const administrator = await administratorFactory.makePrismaAdministrator()
    const accessToken = jwt.sign({ sub: administrator.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient({
      email: 'john@example.com',
    })

    const result = await request(app.getHttpServer())
      .put('/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientId: recipient.id.toString(),
        name: 'John',
        email: 'johndoe@gmail.com',
        phone: '123456',
        street: 'Dacota',
        number: 'AO0',
        city: 'PR',
        state: 'PR',
        zipcode: '12346578',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    expect(result.statusCode).toBe(204)

    const recipientOnDatabase = await prisma.recipient.findUnique({
      where: {
        email: 'johndoe@gmail.com',
      },
    })

    expect(recipientOnDatabase).toBeTruthy()
    expect(recipientOnDatabase?.name).toEqual('John')
  })
})
