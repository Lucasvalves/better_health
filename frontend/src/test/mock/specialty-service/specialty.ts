import {
  CreateSpecialtyBody,
  CreateSpecialtyServiceContract
} from '@/data/specialty-service/create-specialty/create-specialty-service'
import { CreateSpecialty, Specialty } from '@/domain/models/specialty'

export class InMemoryCreateSpecialtyService
  implements CreateSpecialtyServiceContract
{
  async exec({ body }: CreateSpecialty): Promise<Specialty> {
    const specialtyBody: CreateSpecialtyBody = {
      name: body.name
    }

    return {
      id: 'specialty-id',
      ...specialtyBody
    }
  }
}
