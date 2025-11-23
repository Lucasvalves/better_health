import { Patient, CreaetPatient } from '@/domain/models/patient'
import {
  HttpMethod,
  IHttpClient
} from '@/infrastructure/contratcs/http-contratcs'

export type CreatePatientBody = Omit<Patient, 'id'>

export type CreatePatientServiceContract = {
  exec: ({ body, token }: CreaetPatient) => Promise<Patient>
}

export class CreatePatientService implements CreatePatientServiceContract {
  private constructor(private readonly HttpClient: IHttpClient) {}

  static create(HttpClient: IHttpClient): CreatePatientService {
    return new CreatePatientService(HttpClient)
  }

  async exec({ body, token }: CreaetPatient): Promise<Patient> {
    const createdPatient = await this.HttpClient.sendRequest<
      Patient,
      CreatePatientBody
    >({
      endpoint: '/patients',
      method: HttpMethod.POST,
      body,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return createdPatient
  }
}
