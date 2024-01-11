import { AdministratorsRepository } from '@/domain/logistic/application/repositories/administrators-repository'
import { Administrator } from '@/domain/logistic/enterprise/entities/administrator'

export class InMemoryAdministratorsRepository
  implements AdministratorsRepository
{
  public items: Administrator[] = []

  async findById(id: string): Promise<Administrator | null> {
    const administrator = this.items.find((item) => item.id.toString() === id)

    if (!administrator) {
      return null
    }

    return administrator
  }

  async findByCPF(cpf: string): Promise<Administrator | null> {
    const administrator = this.items.find((item) => item.cpf === cpf)

    if (!administrator) {
      return null
    }

    return administrator
  }

  async findByEmail(email: string): Promise<Administrator | null> {
    const administrator = this.items.find((item) => item.email === email)

    if (!administrator) {
      return null
    }

    return administrator
  }

  async create(administrator: Administrator): Promise<void> {
    this.items.push(administrator)
  }

  async save(administrator: Administrator): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === administrator.id,
    )

    this.items[itemIndex] = administrator
  }

  async delete(administrator: Administrator): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === administrator.id,
    )

    this.items.splice(itemIndex, 1)
  }
}
