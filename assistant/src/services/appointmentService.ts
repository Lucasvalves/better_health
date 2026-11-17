import {
  BetterHealthApiClient,
  type AppointmentRecord,
  type Doctor,
  type FetchLike,
  type Patient
} from './betterHealthApiClient.ts'
import {
  hasDoctorQuery,
  resolveDoctor,
  type DoctorQuery
} from './doctorResolver.ts'

export type BookAppointmentInput = DoctorQuery & {
  datetime: string
  patientCpf: string
}

export type BookedAppointment = {
  appointment: AppointmentRecord
  doctor: Pick<Doctor, 'name' | 'crm'>
}

export type CancelAppointmentInput = {
  patientCpf: string
  doctorCrm?: string
  doctorName?: string
  datetime?: string
  appointmentId?: string
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

  async listSpecialtyNamesForPrompt(): Promise<string[]> {
    const specialties = await this.client.listSpecialties()
    return specialties.map((specialty) => specialty.name)
  }

  async bookAppointment(input: BookAppointmentInput): Promise<BookedAppointment> {
    const doctor = await this.findDoctor(input)
    const patient = await this.resolvePatient(input.patientCpf)

    const appointment = await this.client.createAppointment({
      patients_id: patient.id,
      specialties_id: doctor.specialties_id,
      doctors_id: doctor.id,
      date: new Date(input.datetime).toISOString()
    })

    return { appointment, doctor: { name: doctor.name, crm: doctor.crm } }
  }

  async cancelAppointment(input: CancelAppointmentInput): Promise<void> {
    const doctorQuery = {
      doctorCrm: input.doctorCrm,
      doctorName: input.doctorName
    }

    if (
      !input.appointmentId &&
      (!hasDoctorQuery(doctorQuery) || !input.datetime)
    ) {
      throw new Error(
        'Appointment ID or doctor name/CRM and datetime are required to cancel'
      )
    }

    const patient = await this.resolvePatient(input.patientCpf)
    const appointments = await this.client.listAppointmentsByPatient(patient.id)

    const match = input.appointmentId
      ? appointments.find((appointment) => appointment.id === input.appointmentId)
      : await this.findByDoctorAndDatetime(
          appointments,
          doctorQuery,
          new Date(input.datetime!)
        )

    if (!match) {
      throw new Error('Agendamento não encontrado para cancelamento')
    }

    await this.client.deleteAppointment(match.id)
  }

  private async findByDoctorAndDatetime(
    appointments: AppointmentRecord[],
    doctorQuery: DoctorQuery,
    target: Date
  ): Promise<AppointmentRecord | undefined> {
    const doctor = await this.findDoctor(doctorQuery)

    return appointments.find(
      (appointment) =>
        appointment.doctors_id === doctor.id &&
        sameSlot(new Date(appointment.date), target)
    )
  }

  private async findDoctor(query: DoctorQuery): Promise<Doctor> {
    const doctors = await this.client.listDoctors()
    return resolveDoctor(doctors, query)
  }

  private async resolvePatient(patientCpf: string): Promise<Patient> {
    const cpf = normalizeCpf(patientCpf)

    if (cpf.length !== 11) {
      throw new Error('Patient CPF must have 11 digits')
    }

    return this.client.findPatientByCpf(cpf)
  }
}
