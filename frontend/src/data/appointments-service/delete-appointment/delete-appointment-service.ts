import { AppointmentsPatientResponse } from '@/domain/models/appointment'
import {
  HttpMethod,
  IHttpClient
} from '@/infrastructure/contratcs/http-contratcs'

export type DeleteAppointment = {
  token?: string
  id: string
}

export type DeleteAppointmentServiceContract = {
  exec: ({
    token,
    id
  }: DeleteAppointment) => Promise<AppointmentsPatientResponse>
}

export class DeleteAppointmentService
  implements DeleteAppointmentServiceContract
{
  private constructor(private readonly HttpClient: IHttpClient) {}

  static create(HttpClient: IHttpClient): DeleteAppointmentService {
    return new DeleteAppointmentService(HttpClient)
  }

  async exec({
    id,
    token
  }: DeleteAppointment): Promise<AppointmentsPatientResponse> {
    const appointmentsPatient =
      await this.HttpClient.sendRequest<AppointmentsPatientResponse>({
        endpoint: `/appointments/${id}`,
        method: HttpMethod.DELETE,
        headers: {
          Authorization: `Bearer ${token}`
        },
      })

    return appointmentsPatient
  }
}
