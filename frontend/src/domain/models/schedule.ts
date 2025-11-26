export type Schedule = {
  days: number
  startHour: string
  endHour: string
  specialties_id: string
  doctors_id: string
}

export type CreateSchedule = {
  body: Schedule
  token?: string
}
