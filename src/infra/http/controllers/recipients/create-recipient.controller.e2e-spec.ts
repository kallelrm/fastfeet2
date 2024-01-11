import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'

describe('Create Recipient (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let administratorFactory: AdministratorFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdministratorFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    administratorFactory = moduleRef.get(AdministratorFactory)

    await app.init()
  })

  test('[POST] /recipients', async () => {
    const administrator = await administratorFactory.makePrismaAdministrator()
    const accessToken = jwt.sign({ sub: administrator.id.toString() })

    const result = await request(app.getHttpServer())
      .post('/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
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

    expect(result.statusCode).toBe(201)

    const recipientOnDatabase = await prisma.recipient.findUnique({
      where: {
        email: 'johndoe@gmail.com',
      },
    })

    expect(recipientOnDatabase).toBeTruthy()
    expect(recipientOnDatabase?.name).toEqual('John')
  })
})
