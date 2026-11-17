import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { HumanMessage } from 'langchain'
import { buildAppointmentGraph } from '../../src/graph/graph.ts'
import { createMessageGeneratorNode } from '../../src/graph/nodes/messageGeneratorNode.ts'
import { SAFETY_ALERT_MESSAGE } from '../../src/prompts/v1/safetyAlert.ts'
import type { OpenRouterService } from '../../src/services/openRouterService.ts'
import type { AppointmentService } from '../../src/services/appointmentService.ts'

const intentWithAlert = {
  intent: 'schedule',
  safetyAlert: true,
  doctorName: 'Erica Silva',
  relativeDay: 'tomorrow',
  hour: 11,
  patientName: 'Maria Santos',
  patientCpf: '12345678909',
}

function fakes(intentData: Record<string, unknown>) {
  const calls = { llm: 0, booked: 0 }

  const llm = {
    generateStructured: async () => {
      calls.llm += 1
      return calls.llm === 1
        ? { success: true, data: intentData }
        : { success: true, data: { message: 'Consulta confirmada para a paciente.' } }
    },
  } as unknown as OpenRouterService

  const service = {
    listSpecialtyNamesForPrompt: async () => [],
    bookAppointment: async () => {
      calls.booked += 1
      return {
        appointment: {
          id: 'appointment-1',
          date: '2026-11-13T11:00:00.000Z',
          patients_id: 'patient-1',
          specialties_id: 'specialty-1',
          doctors_id: 'doctor-1',
        },
        doctor: { name: 'Erica Silva', crm: '12345/SP' },
      }
    },
    cancelAppointment: async () => {
      throw new Error('cancel must not run')
    },
  } as unknown as AppointmentService

  return {
    calls,
    graph: buildAppointmentGraph(llm, service, {
      timeZone: 'America/Sao_Paulo',
      now: () => new Date('2026-11-12T12:00:00.000Z'),
    }),
  }
}

describe('safety alert', () => {
  it('replies with the fixed emergency message without calling the model', async () => {
    let called = false
    const llm = {
      generateStructured: async () => {
        called = true
        return { data: { message: 'should not be used' } }
      },
    } as unknown as OpenRouterService

    const result = await createMessageGeneratorNode(llm)({
      messages: [new HumanMessage('Estou com dor forte no peito')],
      intent: 'schedule',
      safetyAlert: true,
    })

    assert.equal(called, false)
    assert.equal(result.messages!.at(-1)!.text, SAFETY_ALERT_MESSAGE)
  })

  it('does not schedule when the intent carries a safety alert', async () => {
    const { calls, graph } = fakes(intentWithAlert)

    const result = await graph.invoke({
      messages: [
        new HumanMessage('Meu pai está com dor forte no peito, quero marcar uma consulta'),
      ],
    })

    assert.equal(calls.booked, 0)
    assert.equal(calls.llm, 1)
    assert.equal(result.messages.at(-1)!.text, SAFETY_ALERT_MESSAGE)
  })

  it('keeps scheduling normally when there is no safety alert', async () => {
    const { calls, graph } = fakes({ ...intentWithAlert, safetyAlert: false })

    const result = await graph.invoke({
      messages: [new HumanMessage('Sou Maria Santos e quero marcar um check-up amanhã às 11h')],
    })

    assert.equal(calls.booked, 1)
    assert.notEqual(result.messages.at(-1)!.text, SAFETY_ALERT_MESSAGE)
  })
})
