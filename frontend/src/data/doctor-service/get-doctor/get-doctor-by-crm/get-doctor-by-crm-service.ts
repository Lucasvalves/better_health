import { GetDoctorByCRMResponse } from '@/domain/models/doctor'
import {
  HttpMethod,
  IHttpClient
} from '@/infrastructure/contratcs/http-contratcs'

export type GetDoctorByCRM = {
  token: string
  crm: string
}

export type GetDoctorByCRMServiceContract = {
  exec: ({ token, crm }: GetDoctorByCRM) => Promise<GetDoctorByCRMResponse>
}

export class GetDoctorByCRMService implements GetDoctorByCRMServiceContract {
  constructor(private readonly HttpClient: IHttpClient) {}

  static create(HttpClient: IHttpClient): GetDoctorByCRMService {
    return new GetDoctorByCRMService(HttpClient)
  }

  async exec({ crm, token }: GetDoctorByCRM): Promise<GetDoctorByCRMResponse> {
    const doctor = await this.HttpClient.sendRequest<GetDoctorByCRMResponse>({
      endpoint: `/doctors/crm/`,
      method: HttpMethod.POST,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: { crm }
    })

    return doctor
  }
}
