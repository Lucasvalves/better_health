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
