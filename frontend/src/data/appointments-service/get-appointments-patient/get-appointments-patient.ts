import { AppointmentsPatientResponse } from '@/domain/models/appointment'
import {
  HttpMethod,
  IHttpClient
} from '@/infrastructure/contratcs/http-contratcs'

export type GetAppointmentsPatient = {
  token: string
  patient_id: string
}

export type GetAppointmentsPatientServiceContract = {
  exec: ({
    token,
    patient_id
  }: GetAppointmentsPatient) => Promise<AppointmentsPatientResponse>
}

export class GetAppointmentsPatientService
  implements GetAppointmentsPatientServiceContract
{
  private constructor(private readonly HttpClient: IHttpClient) {}

  static create(HttpClient: IHttpClient): GetAppointmentsPatientService {
    return new GetAppointmentsPatientService(HttpClient)
  }

  async exec({
    patient_id,
    token
  }: GetAppointmentsPatient): Promise<AppointmentsPatientResponse> {
    const appointmentsPatient =
      await this.HttpClient.sendRequest<AppointmentsPatientResponse>({
        endpoint: '/appointments/appointments-patient',
        method: HttpMethod.POST,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: { patient_id }
      })

    return appointmentsPatient
  }
}
