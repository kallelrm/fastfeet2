import { Administrator } from '../../enterprise/entities/Administrator'

export abstract class AdministratorsRepository {
  abstract findById(id: string): Promise<Administrator | null>
  abstract findByCPF(cpf: string): Promise<Administrator | null>
  abstract findByEmail(email: string): Promise<Administrator | null>
  abstract create(Administrator: Administrator): Promise<void>
  abstract save(Administrator: Administrator): Promise<void>
  abstract delete(Administrator: Administrator): Promise<void>
}
