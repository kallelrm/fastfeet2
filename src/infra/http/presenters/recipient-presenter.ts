import { Recipient } from '@/domain/logistic/enterprise/entities/recipient'

export class RecipientPresenter {
  static toHTTP(raw: Recipient) {
    return {
      id: raw.id.toString(),
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      city: raw.city,
      street: raw.street,
      number: raw.number,
      state: raw.state,
      zipcode: raw.zipcode,
      latitude: raw.latitude,
      longitude: raw.longitude,
    }
  }
}
