import { Specialty, CreaetSpecialty } from '@/domain/models/specialty'
import {
  HttpMethod,
  IHttpClient
} from '@/infrastructure/contratcs/http-contratcs'

export type CreateSpecialtyBody = Omit<Specialty, 'id'>

export type CreateSpecialtyServiceContract = {
  exec: ({ body, token }: CreaetSpecialty) => Promise<Specialty>
}

export class CreateSpecialtyService implements CreateSpecialtyServiceContract {
  private constructor(private readonly HttpClient: IHttpClient) {}

  static create(HttpClient: IHttpClient): CreateSpecialtyService {
    return new CreateSpecialtyService(HttpClient)
  }

  async exec({ body, token }: CreaetSpecialty): Promise<Specialty> {
    const createdSpecialty = await this.HttpClient.sendRequest<
      Specialty,
      CreateSpecialtyBody
    >({
      endpoint: '/specialties',
      method: HttpMethod.POST,
      body,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    console.log(
      '🚀 ~ CreateSpecialtyService ~ exec ~ createdSpecialty:',
      createdSpecialty
    )
    return createdSpecialty
  }
}
