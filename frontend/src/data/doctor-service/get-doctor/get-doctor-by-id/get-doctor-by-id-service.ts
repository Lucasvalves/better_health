import { getDoctorByIDServiceResponse } from '@/domain/models/doctor'
import {
  HttpMethod,
  IHttpClient
} from '@/infrastructure/contratcs/http-contratcs'

export type getDoctorByIDService = {
  token: string
  id: string
}

export type getDoctorByIDServiceServiceContract = {
  exec: ({ token, id }: getDoctorByIDService) => Promise<getDoctorByIDServiceResponse>
}

export class getDoctorByIDServiceService implements getDoctorByIDServiceServiceContract {
  constructor(private readonly HttpClient: IHttpClient) {}

  static create(HttpClient: IHttpClient): getDoctorByIDServiceService {
    return new getDoctorByIDServiceService(HttpClient)
  }

  async exec({ id, token }: getDoctorByIDService): Promise<getDoctorByIDServiceResponse> {
    const doctor = await this.HttpClient.sendRequest<getDoctorByIDServiceResponse>({
      endpoint: `/doctors/${id}`,
      method: HttpMethod.GET,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return doctor
  }
}
