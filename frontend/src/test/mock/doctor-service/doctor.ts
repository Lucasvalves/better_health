import {
  GetDoctorByCRM,
  GetDoctorByCRMServiceContract
} from '@/data/doctor-service/get-doctor/get-doctor-by-crm/get-doctor-by-crm-service'
import { GetDoctorByCRMResponse } from '@/domain/models/doctor'

export class InMemoryGetDoctorByCRMService
  implements GetDoctorByCRMServiceContract
{
  async exec({ crm, token }: GetDoctorByCRM): Promise<GetDoctorByCRMResponse> {
    if (!token) {
      throw new Error('Token not found')
    }

    return {
      id: 'doctor-id',
      name: 'Dr. Teste',
      crm,
      specialties_id: 'specialty-id',
      Specialties: {
        id: 'specialty-id',
        name: 'Cardiologia'
      }
    }
  }
}
