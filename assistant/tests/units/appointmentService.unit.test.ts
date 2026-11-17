import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { AppointmentService } from '../../src/services/appointmentService.ts'
import { DoctorSelectionError } from '../../src/services/doctorResolver.ts'

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function serviceWith(fetchFn: typeof fetch) {
  return new AppointmentService({
    baseUrl: 'http://localhost:3333',
    authToken: 'token',
    fetchFn,
  })
}

const patient = { id: 'pat-1', name: 'Maria Santos', cpf: '12345678909', phone: '999' }

const doctors = [
  {
    id: 'doc-1',
    name: 'Dr. Alicio',
    crm: '12345/SP',
    specialties_id: 'spec-1',
    Specialties: { id: 'spec-1', name: 'Cardiologia' },
  },
  {
    id: 'doc-2',
    name: 'Dra. Ana Pereira',
    crm: '67890/SP',
    specialties_id: 'spec-1',
    Specialties: { id: 'spec-1', name: 'Cardiologia' },
  },
]

describe('AppointmentService', () => {
  describe('book', () => {
    function bookFetch(requests: string[] = []): typeof fetch {
      return async (input, init) => {
        const url = String(input)
        const method = init?.method ?? 'GET'
        requests.push(`${method} ${url}`)

        if (url.endsWith('/patients/cpf/') && method === 'POST') {
          assert.deepEqual(JSON.parse(String(init?.body)), { cpf: '12345678909' })
          return jsonResponse(patient)
        }

        if (url.endsWith('/doctors') && method === 'GET') {
          return jsonResponse(doctors)
        }

        if (url.endsWith('/appointments') && method === 'POST') {
          const body = JSON.parse(String(init?.body))
          assert.deepEqual(body, {
            patients_id: 'pat-1',
            specialties_id: 'spec-1',
            doctors_id: 'doc-1',
            date: '2026-02-12T16:00:00.000Z',
          })
          return jsonResponse({ id: 'appt-1', ...body }, 201)
        }

        throw new Error(`Unexpected request ${method} ${url}`)
      }
    }

    const slot = '2026-02-12T16:00:00.000Z'

    it('books resolving the patient by CPF only and the doctor by name', async () => {
      const requests: string[] = []

      const result = await serviceWith(bookFetch(requests)).bookAppointment({
        doctorName: 'Dr. Alicio',
        datetime: slot,
        patientCpf: '123.456.789-09',
      })

      assert.equal(result.appointment.id, 'appt-1')
      assert.deepEqual(result.doctor, { name: 'Dr. Alicio', crm: '12345/SP' })
      assert.equal(
        requests.some((request) => request.endsWith('/patients')),
        false,
      )
    })

    it('books resolving the doctor by CRM', async () => {
      const result = await serviceWith(bookFetch()).bookAppointment({
        doctorCrm: 'CRM 12345/SP',
        datetime: slot,
        patientCpf: '12345678909',
      })

      assert.equal(result.appointment.doctors_id, 'doc-1')
    })

    it('does not book when only the specialty is given and returns the doctor options', async () => {
      const requests: string[] = []

      await assert.rejects(
        () =>
          serviceWith(bookFetch(requests)).bookAppointment({
            specialtyName: 'Cardiologia',
            datetime: slot,
            patientCpf: '12345678909',
          }),
        (error: unknown) => {
          assert.ok(error instanceof DoctorSelectionError)
          assert.deepEqual(
            error.options.map((option) => option.crm),
            ['12345/SP', '67890/SP'],
          )
          return true
        },
      )

      assert.equal(
        requests.some((request) => request.startsWith('POST') && request.endsWith('/appointments')),
        false,
      )
    })

    it('rejects a CPF without 11 digits before creating the appointment', async () => {
      const requests: string[] = []

      await assert.rejects(
        () =>
          serviceWith(bookFetch(requests)).bookAppointment({
            doctorName: 'Dr. Alicio',
            datetime: slot,
            patientCpf: '123',
          }),
        { message: 'Patient CPF must have 11 digits' },
      )

      assert.equal(
        requests.some((request) => request.startsWith('POST')),
        false,
      )
    })
  })

  describe('cancel', () => {
    function cancelFetch(state: { deletedId?: string }): typeof fetch {
      return async (input, init) => {
        const url = String(input)
        const method = init?.method ?? 'GET'

        if (url.endsWith('/patients/cpf/') && method === 'POST') {
          return jsonResponse({ ...patient, name: 'Joao da Silva' })
        }

        if (url.endsWith('/doctors') && method === 'GET') {
          return jsonResponse(doctors)
        }

        if (url.endsWith('/appointments/appointments-patient') && method === 'POST') {
          return jsonResponse([
            {
              id: 'appt-9',
              date: '2026-02-11T11:00:00.000Z',
              patients_id: 'pat-1',
              specialties_id: 'spec-1',
              doctors_id: 'doc-2',
            },
          ])
        }

        if (url.includes('/appointments/appt-') && method === 'DELETE') {
          state.deletedId = url.split('/').at(-1)
          return jsonResponse({ id: state.deletedId })
        }

        throw new Error(`Unexpected request ${method} ${url}`)
      }
    }

    it('cancels the appointment matching doctor name and datetime for the CPF patient', async () => {
      const state: { deletedId?: string } = {}

      await serviceWith(cancelFetch(state)).cancelAppointment({
        patientCpf: '12345678909',
        doctorName: 'Ana Pereira',
        datetime: '2026-02-11T11:00:30.000Z',
      })

      assert.equal(state.deletedId, 'appt-9')
    })

    it('cancels the appointment matching doctor CRM and datetime', async () => {
      const state: { deletedId?: string } = {}

      await serviceWith(cancelFetch(state)).cancelAppointment({
        patientCpf: '12345678909',
        doctorCrm: '67890/SP',
        datetime: '2026-02-11T11:00:00.000Z',
      })

      assert.equal(state.deletedId, 'appt-9')
    })

    it('does not cancel an appointment with another doctor at the same time', async () => {
      const state: { deletedId?: string } = {}

      await assert.rejects(
        () =>
          serviceWith(cancelFetch(state)).cancelAppointment({
            patientCpf: '12345678909',
            doctorCrm: '12345/SP',
            datetime: '2026-02-11T11:00:00.000Z',
          }),
        { message: 'Agendamento não encontrado para cancelamento' },
      )

      assert.equal(state.deletedId, undefined)
    })

    it('cancels by appointment id when it belongs to the CPF patient', async () => {
      const state: { deletedId?: string } = {}

      await serviceWith(cancelFetch(state)).cancelAppointment({
        patientCpf: '12345678909',
        appointmentId: 'appt-9',
      })

      assert.equal(state.deletedId, 'appt-9')
    })

    it('does not delete an appointment id that belongs to another patient', async () => {
      const state: { deletedId?: string } = {}

      await assert.rejects(
        () =>
          serviceWith(cancelFetch(state)).cancelAppointment({
            patientCpf: '12345678909',
            appointmentId: 'appt-other',
          }),
        { message: 'Agendamento não encontrado para cancelamento' },
      )

      assert.equal(state.deletedId, undefined)
    })

    it('requires an appointment id or doctor and datetime', async () => {
      const state: { deletedId?: string } = {}

      await assert.rejects(
        () =>
          serviceWith(cancelFetch(state)).cancelAppointment({
            patientCpf: '12345678909',
          }),
        {
          message:
            'Appointment ID or doctor name/CRM and datetime are required to cancel',
        },
      )
    })
  })
})
