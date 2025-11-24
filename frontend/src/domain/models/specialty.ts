export type Specialty = {
  id?: string
  name: string
}

export type CreateSpecialty = {
  body: Specialty
  token?: string
}
