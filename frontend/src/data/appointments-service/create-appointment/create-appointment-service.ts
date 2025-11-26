import { Appointment, CreateAppointment } from '@/domain/models/appointment'
import {
  HttpMethod,
  IHttpClient
} from '@/infrastructure/contratcs/http-contratcs'

export type CreateAppointmentBody = Omit<Appointment, 'id'>

export type CreateAppointmentServiceContract = {
  exec: ({ body, token }: CreateAppointment) => Promise<Appointment>
}

export class CreateAppointmentService
  implements CreateAppointmentServiceContract
{
  private constructor(private readonly HttpClient: IHttpClient) {}

  static create(HttpClient: IHttpClient): CreateAppointmentService {
    return new CreateAppointmentService(HttpClient)
  }

  async exec({ body, token }: CreateAppointment): Promise<Appointment> {
    console.log('🚀 ~ CreateAppointmentService ~ exec ~ body:', body)
    const createdAppointment = await this.HttpClient.sendRequest<
      Appointment,
      CreateAppointmentBody
    >({
      endpoint: '/appointments',
      method: HttpMethod.POST,
      body,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log(
      '🚀 ~ CreateAppointmentService ~ exec ~ createdAppointment:',
      createdAppointment
    )

    return createdAppointment
  }
}
