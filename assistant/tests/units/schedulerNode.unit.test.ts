import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { HumanMessage } from 'langchain'
import { createSchedulerNode } from '../../src/graph/nodes/schedulerNode.ts'
import type { AppointmentService } from '../../src/services/appointmentService.ts'
import type { GraphState } from '../../src/graph/graph.ts'

const created = {
  id: '0d1da9fd-3ca5-4f65-b7b5-0865289f8ca8',
  date: '2026-11-10T15:00:00.000Z',
  patients_id: '6421bb7a-d8f2-4e8f-8c99-4671180da0c3',
  specialties_id: '5522c737-d0df-4002-8aa6-8c02476576e8',
  doctors_id: 'e4d2e938-126d-4d58-90e3-bdd69aeeaf02',
}

function state(): GraphState {
  return {  
    messages: [new HumanMessage('Quero agendar uma consulta')],
    doctors_id: created.doctors_id,
    datetime: '2026-11-10T12:00:00.000Z',
    patientName: 'Maria Santos',
  }
}

describe('scheduler node', () => {
  it('confirms the appointment only when the server returns the created record', async () => {
    const service = {
      bookAppointment: async () => created,
    } as unknown as AppointmentService

    const result = await createSchedulerNode(service)(state())

    assert.equal(result.actionSuccess, true)
    assert.equal(result.actionError, undefined)
    assert.equal(result.datetime, created.date)
    assert.equal(result.appointmentData.id, created.id)
  })

  it('marks scheduling as failed when the server response has no appointment id', async () => {
    const service = {
      bookAppointment: async () => ({ ok: true }),
    } as unknown as AppointmentService

    const result = await createSchedulerNode(service)(state())

    assert.equal(result.actionSuccess, false)
    assert.equal(result.actionError, 'The server did not confirm the appointment')
  })
})
