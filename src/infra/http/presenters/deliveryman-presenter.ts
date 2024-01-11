import { Deliveryman } from '@/domain/logistic/enterprise/entities/deliveryman'

export class DeliverymanPresenter {
  static toHTTP(raw: Deliveryman) {
    return {
      id: raw.id.toString(),
      name: raw.name,
      lastname: raw.lastname,
      email: raw.email,
      cpf: raw.cpf,
      phone: raw.phone,
    }
  }
}
