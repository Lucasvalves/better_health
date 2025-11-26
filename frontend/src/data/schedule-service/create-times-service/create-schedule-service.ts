import { Schedule, CreateSchedule } from '@/domain/models/schedule'
import {
  HttpMethod,
  IHttpClient
} from '@/infrastructure/contratcs/http-contratcs'

export type CreateScheduleBody = Omit<Schedule, 'id'>

export type CreateScheduleServiceContract = {
  exec: ({ body, token }: CreateSchedule) => Promise<Schedule>
}

export class CreateScheduleService implements CreateScheduleServiceContract {
   constructor(private readonly HttpClient: IHttpClient) {}

  static create(HttpClient: IHttpClient): CreateScheduleService {
    return new CreateScheduleService(HttpClient)
  }

  async exec({ body, token }: CreateSchedule): Promise<Schedule> {
    const createdSchedule = await this.HttpClient.sendRequest<
      Schedule,
      CreateScheduleBody
    >({
      endpoint: '/times',
      method: HttpMethod.POST,
      body,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return createdSchedule
  }
}
