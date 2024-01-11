import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Recipient } from '@/domain/logistic/enterprise/entities/Recipient'
import { Prisma, Recipient as PrismaRecipient } from '@prisma/client'

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        email: raw.email,
        city: raw.city,
        latitude: Number(raw.latitude),
        longitude: Number(raw.longitude),
        number: raw.number,
        phone: raw.phone,
        state: raw.state,
        street: raw.street,
        zipcode: raw.zipcode,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
      city: recipient.city,
      latitude: recipient.latitude,
      longitude: recipient.longitude,
      number: recipient.number,
      phone: recipient.phone,
      state: recipient.state,
      street: recipient.street,
      zipcode: recipient.zipcode,
    }
  }
}
