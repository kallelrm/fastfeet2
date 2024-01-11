import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'

describe('Register Deliveryman (E2E)', () => {
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

  test('[POST] /deliveryman', async () => {
    const administrator = await administratorFactory.makePrismaAdministrator()
    const accessToken = jwt.sign({ sub: administrator.id.toString() })

    const result = await request(app.getHttpServer())
      .post('/deliveryman')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John',
        lastname: 'Doe',
        email: 'johndoe@gmail.com',
        phone: '123456',
        cpf: '23131253432',
        password: '123456',
      })

    expect(result.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        cpf: '23131253432',
      },
    })

    expect(userOnDatabase).toBeTruthy()
    expect(userOnDatabase?.name).toEqual('John')
  })
})
