import { Patient } from '@/domain/models/patient'
import {
  HttpMethod,
  IHttpClient
} from '@/infrastructure/contratcs/http-contratcs'

export type GetPatientByCPF = {
  token: string
  cpf: string
}

export type GetPatientByCPFServiceContract = {
  exec: ({ token, cpf }: GetPatientByCPF) => Promise<Patient>
}

export class GetPatientByCPFService implements GetPatientByCPFServiceContract {
  constructor(private readonly HttpClient: IHttpClient) {}

  static create(HttpClient: IHttpClient): GetPatientByCPFService {
    return new GetPatientByCPFService(HttpClient)
  }

  async exec({ cpf, token }: GetPatientByCPF): Promise<Patient> {
    const Patient = await this.HttpClient.sendRequest<Patient>({
      endpoint: `/patients/cpf/`,
      method: HttpMethod.POST,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: { cpf }
    })

    return Patient
  }
}
