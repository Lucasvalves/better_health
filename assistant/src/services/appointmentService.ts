import {
  BetterHealthApiClient,
  type AppointmentRecord,
  type Doctor,
  type FetchLike,
  type Patient
} from './betterHealthApiClient.ts'

export type ProfessionalForPrompt = {   
  id: string
  name: string
  specialty: string
  specialties_id: string
}

export type BookAppointmentInput = {
  doctors_id: string
  specialties_id?: string
  datetime: string
  patientName?: string
  patientCpf?: string
}

export type CancelAppointmentInput = {
  doctors_id?: string
  datetime?: string
  patientName?: string
  patientCpf?: string
  appointmentId?: string
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase()
}

function normalizeCpf(value: string): string {
  return value.replace(/\D/g, '')
}

function sameSlot(left: Date, right: Date): boolean {
  return Math.abs(left.getTime() - right.getTime()) < 60_000
}

export class AppointmentService {
  private readonly client: BetterHealthApiClient

  constructor(options: {
    baseUrl: string
    authToken: string
    fetchFn?: FetchLike
  }) {
    if (!options.authToken.trim()) {
      throw new Error('Better Health auth token is required')
    }

    this.client = new BetterHealthApiClient(
      options.baseUrl,
      options.authToken,
      options.fetchFn,
    )
  }

  async listProfessionalsForPrompt(): Promise<ProfessionalForPrompt[]> {
    const doctors = await this.client.listDoctors()
    return doctors.map((doctor) => this.toProfessional(doctor))
  }

  async bookAppointment(
    input: BookAppointmentInput
  ): Promise<AppointmentRecord> {
    const patient = await this.resolvePatient(
      input.patientCpf,
      input.patientName
    )
    const specialties_id =
      input.specialties_id ?? (await this.resolveSpecialtyId(input.doctors_id))

    return this.client.createAppointment({
      patients_id: patient.id,
      specialties_id,
      doctors_id: input.doctors_id,
      date: new Date(input.datetime).toISOString()
    })
  }

  async cancelAppointment(input: CancelAppointmentInput): Promise<void> {
    if (input.appointmentId) {
      await this.client.deleteAppointment(input.appointmentId)
      return
    }

    if (!input.doctors_id || !input.datetime) {
      throw new Error(
        'Appointment ID or doctor ID and datetime are required to cancel'
      )
    }

    const patient = await this.resolvePatient(
      input.patientCpf,
      input.patientName
    )
    const appointments = await this.client.listAppointmentsByPatient(patient.id)
    const target = new Date(input.datetime)

    const match = appointments.find(
      (appointment) =>
        appointment.doctors_id === input.doctors_id &&
        sameSlot(new Date(appointment.date), target)
    )

    if (!match) {
      throw new Error('Agendamento não encontrado para cancelamento')
    }

    await this.client.deleteAppointment(match.id)
  }

  private async resolveSpecialtyId(doctors_id: string): Promise<string> {
    const doctors = await this.client.listDoctors()
    const doctor = doctors.find((item) => item.id === doctors_id)
    if (!doctor) {
      throw new Error('Doctor not found')
    }
    return doctor.specialties_id
  }

  private async resolvePatient(
    patientCpf?: string,
    patientName?: string
  ): Promise<Patient> {
    if (patientCpf) {
      return this.client.findPatientByCpf(normalizeCpf(patientCpf))
    }

    if (!patientName) {
      throw new Error('Patient CPF or name is required')
    }

    const patients = await this.client.listPatients()
    const matches = patients.filter(
      (patient) => normalizeName(patient.name) === normalizeName(patientName)
    )

    if (matches.length === 0) {
      throw new Error('Patient not found')
    }

    if (matches.length > 1) {
      throw new Error('Multiple patients found with this name; provide the CPF')
    }

    return matches[0]!
  }

  private toProfessional(doctor: Doctor): ProfessionalForPrompt {
    return {
      id: doctor.id,
      name: doctor.name,
      specialty: doctor.Specialties?.name ?? doctor.specialties_id,
      specialties_id: doctor.specialties_id
    }
  }
}
