export type Patient = {
  id?: string
  name: string
  cpf: string
  phone: string
}

export type CreaetPatient = {
  body: Patient
  token?: string
}
