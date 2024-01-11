import { PaginationParams } from '@/core/repositories/paginations-params'
import { Deliveryman } from '../../enterprise/entities/deliveryman'

export abstract class DeliverymansRepository {
  abstract findById(id: string): Promise<Deliveryman | null>
  abstract findByIdentifier(cpf: string): Promise<Deliveryman | null>
  abstract findByEmail(email: string): Promise<Deliveryman | null>
  abstract findMany(params: PaginationParams): Promise<Deliveryman[]>
  abstract create(deliveryman: Deliveryman): Promise<void>
  abstract save(deliveryman: Deliveryman): Promise<void>
  abstract delete(deliveryman: Deliveryman): Promise<void>
}
