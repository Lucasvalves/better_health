import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { HumanMessage } from 'langchain'
import { createSchedulerNode } from '../../src/graph/nodes/schedulerNode.ts'
import type { AppointmentService } from '../../src/services/appointmentService.ts'
import { DoctorSelectionError } from '../../src/services/doctorResolver.ts'
import type { GraphState } from '../../src/graph/graph.ts'

const NOW = () => new Date('2026-11-01T00:00:00.000Z')

const created = {
  id: '0d1da9fd-3ca5-4f65-b7b5-0865289f8ca8',
  date: '2026-11-10T15:00:00.000Z',
  patients_id: '6421bb7a-d8f2-4e8f-8c99-4671180da0c3',
  specialties_id: '5522c737-d0df-4002-8aa6-8c02476576e8',
  doctors_id: 'e4d2e938-126d-4d58-90e3-bdd69aeeaf02',
}

const booked = {
  appointment: created,
  doctor: { name: 'Dra. Erica Silva', crm: '12345/SP' },
}

function state(overrides: Partial<GraphState> = {}): GraphState {
  return {
    messages: [new HumanMessage('Quero agendar uma consulta')],
    doctorName: 'Erica',
    datetime: '2026-11-10T12:00:00.000Z',
    patientName: 'Maria Santos',
    patientCpf: '123.456.789-09',
    ...overrides,
  }
}

function spyService(result: unknown = booked) {
  const calls: Array<Record<string, unknown>> = []
  const service = {
    bookAppointment: async (input: Record<string, unknown>) => {
      calls.push(input)
      return result
    },
  } as unknown as AppointmentService
  return { calls, service }
}

describe('scheduler node', () => {
  it('confirms the appointment only when the server returns the created record', async () => {
    const { service } = spyService()

    const result = await createSchedulerNode(service, NOW)(state())

    assert.equal(result.actionSuccess, true)
    assert.equal(result.actionError, undefined)
    assert.equal(result.datetime, created.date)
    assert.equal(result.doctorName, 'Dra. Erica Silva')
    assert.equal(result.appointmentData.id, created.id)
  })

  it('marks scheduling as failed when the server response has no appointment id', async () => {
    const { service } = spyService({ ...booked, appointment: { ok: true } })

    const result = await createSchedulerNode(service, NOW)(state())

    assert.equal(result.actionSuccess, false)
    assert.equal(result.actionError, 'The server did not confirm the appointment')
  })

  it('sends only the CPF digits to the service and never the patient name', async () => {
    const { calls, service } = spyService()

    await createSchedulerNode(service, NOW)(state())

    assert.equal(calls[0]?.patientCpf, '12345678909')
    assert.equal('patientName' in (calls[0] ?? {}), false)
  })

  it('does not schedule when only the name is given and asks for the CPF', async () => {
    const { calls, service } = spyService()

    const result = await createSchedulerNode(service, NOW)(
      state({ patientCpf: undefined }),
    )

    assert.equal(calls.length, 0)
    assert.equal(result.actionSuccess, false)
    assert.equal(result.actionError, 'Patient CPF is required')
  })

  it('does not schedule when the CPF does not have 11 digits', async () => {
    const { calls, service } = spyService()

    const result = await createSchedulerNode(service, NOW)(
      state({ patientCpf: '123.456' }),
    )

    assert.equal(calls.length, 0)
    assert.equal(result.actionError, 'Patient CPF must have 11 digits')
  })

  it('allows scheduling with only the doctor CRM', async () => {
    const { calls, service } = spyService()

    const result = await createSchedulerNode(service, NOW)(
      state({ doctorName: undefined, doctorCrm: '12345/SP' }),
    )

    assert.equal(result.actionSuccess, true)
    assert.equal(calls[0]?.doctorCrm, '12345/SP')
  })

  it('allows scheduling with only the specialty and leaves the choice to the service', async () => {
    const options = [
      { name: 'Erica Silva', crm: '12345/SP', specialty: 'Cardiologia' },
    ]
    const service = {
      bookAppointment: async () => {
        throw new DoctorSelectionError('Doctors are available', options)
      },
    } as unknown as AppointmentService

    const result = await createSchedulerNode(service, NOW)(
      state({ doctorName: undefined, specialtyName: 'Cardiologia' }),
    )

    assert.equal(result.actionSuccess, false)
    assert.deepEqual(result.doctorOptions, options)
  })

  it('does not schedule without doctor name, CRM or specialty', async () => {
    const { calls, service } = spyService()

    const result = await createSchedulerNode(service, NOW)(
      state({ doctorName: undefined }),
    )

    assert.equal(calls.length, 0)
    assert.equal(result.actionError, 'Doctor name, CRM or specialty is required')
  })

  it('does not schedule a date and time that have already passed', async () => {
    const { calls, service } = spyService()

    const result = await createSchedulerNode(service, NOW)(
      state({ datetime: '2026-10-31T23:59:00.000Z' }),
    )

    assert.equal(calls.length, 0)
    assert.equal(result.actionSuccess, false)
    assert.equal(result.actionError, 'The requested date and time have already passed')
  })

  it('does not schedule without a datetime', async () => {
    const { calls, service } = spyService()

    const result = await createSchedulerNode(service, NOW)(
      state({ datetime: undefined }),
    )

    assert.equal(calls.length, 0)
    assert.equal(result.actionError, 'Appointment datetime is required')
  })
})
