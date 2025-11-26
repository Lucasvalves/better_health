import { Specialty } from './specialty'

export type Doctor = {
  id?: string
  name: string
  crm: string
  specialties_id: string
}

export type CreaetDoctor = {
  body: Doctor
  token?: string
}

export type GetDoctorByCRMResponse = {
  id: string
  name: string
  crm: string
  specialties_id: string
  Specialties?: Specialty
}


export type getDoctorByIDServiceResponse = {
  id: string
  name: string
  crm: string
  specialties_id: string
}
