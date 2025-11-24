import {
  CreatePatientBody,
  CreatePatientServiceContract
} from '@/data/patient-service/create-patient/create-patient-service'
import { CreaetPatient, Patient } from '@/domain/models/patient'

export class InMemoryCreatePatientService
  implements CreatePatientServiceContract
{
  async exec({ body }: CreaetPatient): Promise<Patient> {
    const patientBody: CreatePatientBody = {
      name: body.name,
      cpf: body.cpf,
      phone: body.phone
    }

    return {
      id: 'patient-id',
      ...patientBody
    }
  }
}
