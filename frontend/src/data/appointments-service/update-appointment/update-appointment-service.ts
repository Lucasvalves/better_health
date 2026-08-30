import { AppointmentsPatientResponse } from '@/domain/models/appointment'
import {
  HttpMethod,
  IHttpClient
} from '@/infrastructure/contratcs/http-contratcs'

export type UpdateAppointment = {
  token?: string
  id: string
  newDate: string
}

export type UpdateAppointmentServiceContract = {
  exec: ({
    token,
    id
  }: UpdateAppointment) => Promise<AppointmentsPatientResponse>
}

export class UpdateAppointmentService implements UpdateAppointmentServiceContract {
  private constructor(private readonly HttpClient: IHttpClient) {}

  static create(HttpClient: IHttpClient): UpdateAppointmentService {
    return new UpdateAppointmentService(HttpClient)
  }

  async exec({
    id,
    token,
    newDate
  }: UpdateAppointment): Promise<AppointmentsPatientResponse> {
    const appointmentsPatient =
      await this.HttpClient.sendRequest<AppointmentsPatientResponse>({
        endpoint: `/appointments/${id}`,
        method: HttpMethod.DELETE,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: { newDate }
      })

    return appointmentsPatient
  }
}
