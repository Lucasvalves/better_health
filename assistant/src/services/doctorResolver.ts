import type { Doctor } from './betterHealthApiClient.ts'

export type DoctorOption = {
  name: string
  crm: string
  specialty: string
}

export type DoctorQuery = {
  doctorCrm?: string
  doctorName?: string
  specialtyName?: string
}

export class DoctorSelectionError extends Error {
  readonly options: DoctorOption[]

  constructor(message: string, options: DoctorOption[] = []) {
    super(message)
    this.name = 'DoctorSelectionError'
    this.options = options
  }
}

const TITLES = new Set(['dr', 'dra', 'doutor', 'doutora', 'medico', 'medica'])

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()
}

function nameTokens(value: string): string[] {
  return normalizeText(value)
    .split(/\s+/)
    .filter((token) => token && !TITLES.has(token))
}

function normalizeCrm(value: string): string {
  return value
    .replace(/[^a-z0-9]/gi, '')
    .toUpperCase()
    .replace(/^CRM/, '')
}

function toOption(doctor: Doctor): DoctorOption {
  return {
    name: doctor.name,
    crm: doctor.crm,
    specialty: doctor.Specialties?.name ?? '',
  }
}

export function hasDoctorQuery(query: DoctorQuery): boolean {
  return Boolean(
    query.doctorCrm?.trim() ||
      query.doctorName?.trim() ||
      query.specialtyName?.trim(),
  )
}

export function resolveDoctor(doctors: Doctor[], query: DoctorQuery): Doctor {
  const crm = query.doctorCrm ? normalizeCrm(query.doctorCrm) : ''

  if (crm) {
    const match = doctors.find((doctor) => normalizeCrm(doctor.crm) === crm)

    if (!match) {
      throw new DoctorSelectionError('No doctor found with this CRM')
    }

    return match
  }

  const queryTokens = query.doctorName ? nameTokens(query.doctorName) : []

  if (queryTokens.length > 0) {
    const matches = doctors.filter((doctor) => {
      const doctorTokens = nameTokens(doctor.name)
      return queryTokens.every((token) => doctorTokens.includes(token))
    })

    if (matches.length === 0) {
      throw new DoctorSelectionError('No doctor found with this name')
    }

    if (matches.length > 1) {
      throw new DoctorSelectionError(
        'More than one doctor matches this name; the user must choose one by name or CRM',
        matches.map(toOption),
      )
    }

    return matches[0]!
  }

  const specialty = query.specialtyName ? normalizeText(query.specialtyName) : ''

  if (specialty) {
    const matches = doctors.filter(
      (doctor) =>
        doctor.Specialties?.name &&
        normalizeText(doctor.Specialties.name) === specialty,
    )

    if (matches.length === 0) {
      throw new DoctorSelectionError('No doctor found for this specialty')
    }

    throw new DoctorSelectionError(
      'Doctors are available for this specialty; the user must choose one by name or CRM',
      matches.map(toOption),
    )
  }

  throw new DoctorSelectionError(
    'Doctor name, CRM or specialty is required',
  )
}
