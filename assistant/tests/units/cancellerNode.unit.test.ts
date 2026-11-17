import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { HumanMessage } from 'langchain'
import { createCancellerNode } from '../../src/graph/nodes/cancellerNode.ts'
import type { AppointmentService } from '../../src/services/appointmentService.ts'
import type { GraphState } from '../../src/graph/graph.ts'

function state(overrides: Partial<GraphState> = {}): GraphState {
  return {
    messages: [new HumanMessage('Quero cancelar minha consulta')],
    doctorName: 'Erica Silva',
    datetime: '2026-11-10T12:00:00.000Z',
    patientName: 'Maria Santos',
    patientCpf: '123.456.789-09',
    ...overrides,
  }
}

function spyService() {
  const calls: Array<Record<string, unknown>> = []
  const service = {
    cancelAppointment: async (input: Record<string, unknown>) => {
      calls.push(input)
    },
  } as unknown as AppointmentService
  return { calls, service }
}

describe('canceller node', () => {
  it('cancels with the CPF digits and never sends the patient name', async () => {
    const { calls, service } = spyService()

    const result = await createCancellerNode(service)(state())

    assert.equal(result.actionSuccess, true)
    assert.equal(calls.length, 1)
    assert.equal(calls[0]?.patientCpf, '12345678909')
    assert.equal('patientName' in (calls[0] ?? {}), false)
  })

  it('does not cancel when only the name is given and asks for the CPF', async () => {
    const { calls, service } = spyService()

    const result = await createCancellerNode(service)(
      state({ patientCpf: undefined }),
    )

    assert.equal(calls.length, 0)
    assert.equal(result.actionSuccess, false)
    assert.equal(result.actionError, 'Patient CPF is required')
  })

  it('does not cancel when the CPF does not have 11 digits', async () => {
    const { calls, service } = spyService()

    const result = await createCancellerNode(service)(
      state({ patientCpf: '1234' }),
    )

    assert.equal(calls.length, 0)
    assert.equal(result.actionError, 'Patient CPF must have 11 digits')
  })

  it('requires an appointment id or doctor and datetime even with a valid CPF', async () => {
    const { calls, service } = spyService()

    const result = await createCancellerNode(service)(
      state({ doctorName: undefined, datetime: undefined }),
    )

    assert.equal(calls.length, 0)
    assert.equal(result.actionError, 'Appointment ID or doctor and datetime are required')
  })

  it('cancels identifying the doctor by CRM', async () => {
    const { calls, service } = spyService()

    const result = await createCancellerNode(service)(
      state({ doctorName: undefined, doctorCrm: '12345/SP' }),
    )

    assert.equal(result.actionSuccess, true)
    assert.equal(calls[0]?.doctorCrm, '12345/SP')
  })

  it('does not accept only a specialty to cancel', async () => {
    const { calls, service } = spyService()

    const result = await createCancellerNode(service)(
      state({ doctorName: undefined, specialtyName: 'Cardiologia' }),
    )

    assert.equal(calls.length, 0)
    assert.equal(result.actionSuccess, false)
  })
})
