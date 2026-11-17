import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { AIMessage, HumanMessage } from 'langchain'
import { buildAppointmentGraph } from '../../src/graph/graph.ts'
import type { OpenRouterService } from '../../src/services/openRouterService.ts'
import type { AppointmentService } from '../../src/services/appointmentService.ts'

const clock = {
  timeZone: 'America/Sao_Paulo',
  now: () => new Date('2026-11-17T12:44:00.000Z'),
}

function graphWith(intentData: Record<string, unknown>) {
  const prompts: string[] = []
  const booked: Array<Record<string, unknown>> = []
  let calls = 0

  const llm = {
    generateStructured: async (_system: string, user: string) => {
      calls += 1
      prompts.push(user)
      return calls === 1
        ? { success: true, data: intentData }
        : { success: true, data: { message: 'Resposta gerada para o usuário.' } }
    },
  } as unknown as OpenRouterService

  const service = {
    listSpecialtyNamesForPrompt: async () => [],
    bookAppointment: async (input: Record<string, unknown>) => {
      booked.push(input)
      return {
        appointment: {
          id: 'appt-1',
          date: '2026-11-18T15:00:00.000Z',
          patients_id: 'pat-1',
          specialties_id: 'spec-1',
          doctors_id: 'doc-1',
        },
        doctor: { name: 'Dra. Erica', crm: '12345/SP' },
      }
    },
  } as unknown as AppointmentService

  return { prompts, booked, graph: buildAppointmentGraph(llm, service, clock) }
}

describe('conversation state', () => {
  it('does not carry the error of the previous run into the new reply', async () => {
    const { prompts, graph } = graphWith({ intent: 'unknown', safetyAlert: false })

    await graph.invoke({
      messages: [new HumanMessage('amanhã às 12 horas')],
      intent: 'schedule',
      actionSuccess: false,
      actionError: 'Appointment datetime is required',
      patientName: 'Lucas',
    })

    const payload = JSON.parse(prompts[1]!)
    assert.equal(payload.scenario, 'unknown')
    assert.equal(payload.details.error, undefined)
    assert.equal(payload.details.patientName, undefined)
  })

  it('completes the request using the details from the earlier messages', async () => {
    const { booked, graph } = graphWith({
      intent: 'schedule',
      safetyAlert: false,
      doctorName: 'Dra. Erica',
      patientCpf: '11122233396',
      relativeDay: 'tomorrow',
      hour: 12,
    })

    const result = await graph.invoke({
      messages: [
        new HumanMessage('Quero marcar com a Dra. Erica, CPF 11122233396'),
        new AIMessage('Qual dia e horário você prefere?'),
        new HumanMessage('amanhã às 12 horas'),
      ],
    })

    assert.equal(booked.length, 1)
    assert.equal(booked[0]?.datetime, '2026-11-18T15:00:00.000Z')
    assert.equal(booked[0]?.patientCpf, '11122233396')
    assert.equal(result.actionSuccess, true)
  })
})
