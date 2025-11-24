import { Specialty } from '@/domain/models/specialty'
import {
  HttpMethod,
  IHttpClient
} from '@/infrastructure/contratcs/http-contratcs'

export type GetSpecialties = {
  token: string
}

export type GetSpecialtiesServiceContract = {
  exec: ({ token }: GetSpecialties) => Promise<Specialty[]>
}

export class GetSpecialtiesService implements GetSpecialtiesServiceContract {
  private constructor(private readonly HttpClient: IHttpClient) {}

  static create(HttpClient: IHttpClient): GetSpecialtiesService {
    return new GetSpecialtiesService(HttpClient)
  }

  async exec({ token }: GetSpecialties): Promise<Specialty[]> {
    const specialties = await this.HttpClient.sendRequest<Specialty[]>({
      endpoint: '/specialties',
      method: HttpMethod.GET,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return specialties
  }
}
