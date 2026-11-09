import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { AppointmentService } from '../src/services/appointmentService.ts'

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('AppointmentService', () => {
  it('books appointment resolving patient by name and specialty from doctor', async () => {
    const fetchFn: typeof fetch = async (input, init) => {
      const url = String(input)
      const method = init?.method ?? 'GET'

      if (url.endsWith('/patients') && method === 'GET') {
        return jsonResponse([
          { id: 'pat-1', name: 'Maria Santos', cpf: '123', phone: '999' },
        ])
      }

      if (url.endsWith('/doctors') && method === 'GET') {
        return jsonResponse([
          {
            id: 'doc-1',
            name: 'Dr. Alicio',
            crm: '111',
            specialties_id: 'spec-1',
            Specialties: { id: 'spec-1', name: 'Cardiologia' },
          },
        ])
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

    const service = new AppointmentService({
      baseUrl: 'http://localhost:3333',
      authToken: 'token',
      fetchFn,
    })

    const appointment = await service.bookAppointment({
      doctors_id: 'doc-1',
      datetime: '2026-02-12T16:00:00.000Z',
      patientName: 'Maria Santos',
    })

    assert.equal(appointment.id, 'appt-1')
  })
})
