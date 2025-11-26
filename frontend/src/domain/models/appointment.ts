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
      [doctorId: string]: string[][] // pares de horários
    }
  }[]
}
