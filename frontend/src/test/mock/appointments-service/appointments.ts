import { Patient } from '@/domain/models/patient'
import { Specialty } from '@/domain/models/specialty'
import {
  Appointment,
  AvailableDaysResponse,
  CreateAppointment
} from '@/domain/models/appointment'
import { getDoctorByIDServiceResponse } from '@/domain/models/doctor'
import {
  GetPatientByCPFServiceContract,
  GetPatientByCPF
} from '@/data/patient-service/get-patient/get-patient-by-cpf-service'
import {
  GetSpecialtiesServiceContract,
  GetSpecialties
} from '@/data/specialty-service/get-specialties-service/get-specialties-service'
import {
  GetAvailableDaysServiceContract,
  GetAvailableDays
} from '@/data/appointments-service/get-available-days-service/get-available-days-service'
import { CreateAppointmentServiceContract } from '@/data/appointments-service/create-appointment/create-appointment-service'
import {
  getDoctorByIDServiceServiceContract,
  getDoctorByIDService
} from '@/data/doctor-service/get-doctor/get-doctor-by-id/get-doctor-by-id-service'

export class InMemoryGetPatientByCPFService
  implements GetPatientByCPFServiceContract
{
  async exec({ cpf, token }: GetPatientByCPF): Promise<Patient> {
    if (!token) {
      throw new Error('Token not found')
    }

    return {
      id: 'patient-id',
      name: 'John Patient',
      cpf,
      phone: '(11) 99999-9999'
    }
  }
}

export class InMemoryGetSpecialtiesService
  implements GetSpecialtiesServiceContract
{
  async exec({ token }: GetSpecialties): Promise<Specialty[]> {
    if (!token) {
      throw new Error('Token not found')
    }

    return [
      {
        id: 'specialty-id-1',
        name: 'Cardiologia'
      },
      {
        id: 'specialty-id-2',
        name: 'Dermatologia'
      }
    ]
  }
}

export class InMemoryGetAvailableDaysService
  implements GetAvailableDaysServiceContract
{
  async exec({
    token,
    body
  }: GetAvailableDays): Promise<AvailableDaysResponse> {
    if (!token) {
      throw new Error('Token not found')
    }

    const tomorrow = new Date(body.date)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfterTomorrow = new Date(body.date)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

    const formatDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}-${month}-${year}`
    }

    return {
      doctrs: ['doctor-id-1'],
      schedule: [
        {
          [formatDate(tomorrow)]: {
            'doctor-id-1': [
              ['09:00', '10:00'],
              ['14:00', '15:00']
            ]
          }
        },
        {
          [formatDate(dayAfterTomorrow)]: {
            'doctor-id-1': [
              ['10:00', '11:00'],
              ['15:00', '16:00']
            ]
          }
        }
      ]
    }
  }
}

export class InMemoryCreateAppointmentService
  implements CreateAppointmentServiceContract
{
  async exec({ body, token }: CreateAppointment): Promise<Appointment> {
    if (!token) {
      throw new Error('Token not found')
    }

    return {
      ...body
    }
  }
}

export class InMemoryGetDoctorByIDService
  implements getDoctorByIDServiceServiceContract
{
  async exec({
    id,
    token
  }: getDoctorByIDService): Promise<getDoctorByIDServiceResponse> {
    if (!token) {
      throw new Error('Token not found')
    }

    return {
      id,
      name: 'Dr. John Doe',
      crm: 'CRM12345',
      specialties_id: 'specialty-id-1'
    }
  }
}
