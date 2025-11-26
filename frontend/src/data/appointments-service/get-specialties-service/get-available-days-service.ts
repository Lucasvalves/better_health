import { AvailableDaysResponse, GetAvailableDaysBody } from '@/domain/models/appointment'
import {
  HttpMethod,
  IHttpClient
} from '@/infrastructure/contratcs/http-contratcs'

export type GetAvailableDays = {
  token: string
  body: GetAvailableDaysBody
}

export type GetAvailableDaysServiceContract = {
  exec: ({ token, body }: GetAvailableDays) => Promise<AvailableDaysResponse>
}

export class GetAvailableDaysService implements GetAvailableDaysServiceContract {
  private constructor(private readonly HttpClient: IHttpClient) {}

  static create(HttpClient: IHttpClient): GetAvailableDaysService {
    return new GetAvailableDaysService(HttpClient)
  }

  async exec({
    body,
    token
  }: GetAvailableDays): Promise<AvailableDaysResponse> {
    const availableDays =
      await this.HttpClient.sendRequest<AvailableDaysResponse>({
        endpoint: '/appointments/available-days',
        method: HttpMethod.POST,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body
      })

    return availableDays
  }
}
