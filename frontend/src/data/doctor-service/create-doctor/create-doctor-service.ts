import { Doctor, CreaetDoctor } from '@/domain/models/doctor'
import {
  HttpMethod,
  IHttpClient
} from '@/infrastructure/contratcs/http-contratcs'

export type CreateDoctorBody = Omit<Doctor, 'id'>

export type CreateDoctorServiceContract = {
  exec: ({ body, token }: CreaetDoctor) => Promise<Doctor>
}

export class CreateDoctorService implements CreateDoctorServiceContract {
  private constructor(private readonly HttpClient: IHttpClient) {}

  static create(HttpClient: IHttpClient): CreateDoctorService {
    return new CreateDoctorService(HttpClient)
  }

  async exec({ body, token }: CreaetDoctor): Promise<Doctor> {
    const createdDoctor = await this.HttpClient.sendRequest<
      Doctor,
      CreateDoctorBody
    >({
      endpoint: '/doctors',
      method: HttpMethod.POST,
      body,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return createdDoctor
  }
}
