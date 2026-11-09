import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { HumanMessage } from 'langchain'
import { createMessageGeneratorNode } from '../src/graph/nodes/messageGeneratorNode.ts'
import type { OpenRouterService } from '../src/services/openRouterService.ts'
import type { GraphState } from '../src/graph/graph.ts'

const APPOINTMENT_ID = '0d1da9fd-3ca5-4f65-b7b5-0865289f8ca8'
const FALLBACK = 'Desculpe, não consegui gerar a resposta agora. Tente novamente.'

function llmCapturingPrompt(prompts: string[], message = 'Consulta confirmada para o paciente.') {
  return {
    generateStructured: async (_systemPrompt: string, userPrompt: string) => {
      prompts.push(userPrompt)
      return { data: { message } }
    },
  } as unknown as OpenRouterService
}

function successState(): GraphState {
  return {
    messages: [new HumanMessage('Quero agendar uma consulta')],
    intent: 'schedule',
    actionSuccess: true,
    doctorName: 'Dr. Alicio',
    datetime: '2026-11-10T12:00:00.000Z',
    patientName: 'Maria Santos',
    appointmentData: {
      id: APPOINTMENT_ID,
      date: '2026-11-10T15:00:00.000Z',
    },
  }
}

describe('message generator node', () => {
  it('sends the confirmed date without the appointment id', async () => {
    const prompts: string[] = []

    await createMessageGeneratorNode(llmCapturingPrompt(prompts))(successState())

    const payload = JSON.parse(prompts[0]!)
    assert.equal(payload.scenario, 'schedule_success')
    assert.equal(payload.details.datetime, '2026-11-10T15:00:00.000Z')
    assert.equal(payload.details.error, undefined)
    assert.equal(JSON.stringify(payload).includes(APPOINTMENT_ID), false)
  })

  it('sends the scheduling error when the appointment was not confirmed', async () => {
    const prompts: string[] = []
    const state: GraphState = {
      messages: [new HumanMessage('Quero agendar uma consulta')],
      intent: 'schedule',
      actionSuccess: false,
      doctorName: 'Dr. Alicio',
      datetime: '2026-11-10T12:00:00.000Z',
      patientName: 'Maria Santos',
      actionError: 'The server did not confirm the appointment',
    }

    await createMessageGeneratorNode(llmCapturingPrompt(prompts))(state)

    const payload = JSON.parse(prompts[0]!)
    assert.equal(payload.scenario, 'schedule_error')
    assert.equal(payload.details.error, 'The server did not confirm the appointment')
  })

  it('replaces a reply that contains an id with the fallback message', async () => {
    const prompts: string[] = []
    const reply = `Sua consulta foi confirmada. O ID da sua consulta é ${APPOINTMENT_ID}.`

    const result = await createMessageGeneratorNode(
      llmCapturingPrompt(prompts, reply),
    )(successState())

    assert.equal(result.messages!.at(-1)!.text, FALLBACK)
  })
})
