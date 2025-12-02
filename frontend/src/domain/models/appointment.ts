import { Patient } from './patient';
import { Specialty } from './specialty'
import { Doctor } from './doctor'

export type Appointment = {
  date: Date
  doctors_id: string
  patients_id: string
  specialties_id: string
}

export type CreateAppointment = {
  body: Appointment
  token?: string
}

export type GetAvailableDaysBody = {
  date: Date
  specialties_id: string
}

export type AvailableDaysResponse = {
  doctrs: string[]
  schedule: {
    [date: string]: {
      [doctorId: string]: string[][]
    }
  }[]
}

export type AppointmentsPatientResponse = {
  date: Date
  id: string
  patients_id: string
  specialties_id: string
  doctors_id: string
  Doctor: Doctor
  Specialties: Specialty
  Patients: Patient
}
