export type Doctor = {
  id: string
  name: string
  crm: string
  specialties_id: string
  Specialties?: {
    id: string
    name: string
  }
}

export type Specialty = {
  id: string
  name: string
}

export type Patient = {
  id: string
  name: string
  cpf: string
  phone: string
}

export type AppointmentRecord = {
  id: string
  date: string
  patients_id: string
  specialties_id: string
  doctors_id: string
  Doctors?: {
    id: string
    name: string
  }
  Specialties?: {
    id: string
    name: string
  }
  Patients?: {
    id: string
    name: string
  }
}

export type CreateAppointmentInput = {
  patients_id: string
  specialties_id: string
  doctors_id: string
  date: string
}

export class BetterHealthApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'BetterHealthApiError'
    this.status = status
  }
}

export type FetchLike = typeof fetch

export class BetterHealthApiClient {
  private readonly baseUrl: string
  private readonly authToken: string
  private readonly fetchFn: FetchLike

  constructor(baseUrl: string, authToken: string, fetchFn: FetchLike = fetch) {
    this.baseUrl = baseUrl
    this.authToken = authToken
    this.fetchFn = fetchFn
  }

  private url(path: string): string {
    return `${this.baseUrl.replace(/\/$/, '')}${path}`
  }

  private async request<T>(
    path: string,
    init: {
      method: string
      body?: unknown
    }
  ): Promise<T> {
    const response = await this.fetchFn(this.url(path), {
      method: init.method,
      headers: {
        Authorization: `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body)
    })

    const text = await response.text()
    let payload: unknown = undefined
    if (text) {
      try {
        payload = JSON.parse(text)
      } catch {
        payload = { message: text }
      }
    }

    if (!response.ok) {
      const message =
        typeof payload === 'object' &&
        payload !== null &&
        'message' in payload &&
        typeof (payload as { message: unknown }).message === 'string'
          ? (payload as { message: string }).message
          : `Better Health API error (${response.status})`
      throw new BetterHealthApiError(message, response.status)
    }

    return payload as T
  }

  listDoctors(): Promise<Doctor[]> {
    return this.request<Doctor[]>('/doctors', { method: 'GET' })
  }

  listSpecialties(): Promise<Specialty[]> {
    return this.request<Specialty[]>('/specialties', { method: 'GET' })
  }

  listPatients(): Promise<Patient[]> {
    return this.request<Patient[]>('/patients', { method: 'GET' })
  }

  findPatientByCpf(cpf: string): Promise<Patient> {
    return this.request<Patient>('/patients/cpf/', {
      method: 'POST',
      body: { cpf }
    })
  }

  createAppointment(body: CreateAppointmentInput): Promise<AppointmentRecord> {
    return this.request<AppointmentRecord>('/appointments', {
      method: 'POST',
      body
    })
  }

  listAppointmentsByPatient(patient_id: string): Promise<AppointmentRecord[]> {
    return this.request<AppointmentRecord[]>(
      '/appointments/appointments-patient',
      {
        method: 'POST',
        body: { patient_id }
      }
    )
  }

  deleteAppointment(id: string): Promise<AppointmentRecord> {
    return this.request<AppointmentRecord>(`/appointments/${id}`, {
      method: 'DELETE'
    })
  }
}
