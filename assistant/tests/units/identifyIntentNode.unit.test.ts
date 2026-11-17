import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { AIMessage, HumanMessage } from 'langchain'
import { createIdentifyIntentNode } from '../../src/graph/nodes/identifyIntentNode.ts'
import type { OpenRouterService } from '../../src/services/openRouterService.ts'
import type { AppointmentService } from '../../src/services/appointmentService.ts'

const NOW = new Date('2026-11-17T12:44:00.000Z')

function nodeWith(
  intentData: Record<string, unknown>,
  prompts: string[] = [],
  userPrompts: string[] = [],
) {
  const llm = {
    generateStructured: async (systemPrompt: string, userPrompt: string) => {
      prompts.push(systemPrompt)
      userPrompts.push(userPrompt)
      return { success: true, data: intentData }
    },
  } as unknown as OpenRouterService

  const service = {
    listSpecialtyNamesForPrompt: async () => ['Clínico Geral', 'Cardiologia'],
  } as unknown as AppointmentService

  return createIdentifyIntentNode(llm, service, {
    timeZone: 'America/Sao_Paulo',
    now: () => NOW,
  })
}

const state = { messages: [new HumanMessage('Quero uma consulta')] }

describe('identify intent node', () => {
  it('reads the date and time from the text even when the model fills the wrong fields', async () => {
    const result = await nodeWith({
      intent: 'schedule',
      safetyAlert: false,
      appointmentId: 'Clinico',
      patientCpf: '06461740538',
      patientName: 'lucas',
      reason: 'relativeDay:tomorrow,hour:11',
    })({
      messages: [
        new HumanMessage(
          'Olá, meu nome é Lucas, meu cpf é 06461740538 e eu gostaria de marcar um medico clinico amanhã as 11 horas.',
        ),
      ],
    })

    assert.equal(result.datetime, '2026-11-18T14:00:00.000Z')
    assert.equal(result.specialtyName, 'Clínico Geral')
    assert.equal(result.appointmentId, undefined)
  })

  it('reads a short follow-up answer by itself', async () => {
    const result = await nodeWith({ intent: 'schedule', safetyAlert: false })({
      messages: [
        new HumanMessage('Quero marcar um clínico'),
        new AIMessage('Qual dia e horário você prefere?'),
        new HumanMessage('Amanhã as 14 horas'),
      ],
    })

    assert.equal(result.datetime, '2026-11-18T17:00:00.000Z')
  })

  it('keeps a valid appointment id and drops any other text', async () => {
    const id = '0d1da9fd-3ca5-4f65-b7b5-0865289f8ca8'

    const valid = await nodeWith({ intent: 'cancel', safetyAlert: false, appointmentId: id })(state)
    const invalid = await nodeWith({ intent: 'cancel', safetyAlert: false, appointmentId: 'Clinico' })(state)

    assert.equal(valid.appointmentId, id)
    assert.equal(invalid.appointmentId, undefined)
  })

  it('accepts only a specialty that exists in the list', async () => {
    const listed = await nodeWith({ intent: 'schedule', safetyAlert: false, specialtyName: 'cardiologia' })(state)
    const unknown = await nodeWith({ intent: 'schedule', safetyAlert: false, specialtyName: 'Neurologia' })(state)

    assert.equal(listed.specialtyName, 'Cardiologia')
    assert.equal(unknown.specialtyName, undefined)
  })

  it('treats null date fields from the model as missing', async () => {
    const result = await nodeWith({
      intent: 'schedule',
      safetyAlert: false,
      relativeDay: 'tomorrow',
      hour: 10,
      minute: null,
      weekday: null,
      day: null,
    })(state)

    assert.equal(result.datetime, '2026-11-18T13:00:00.000Z')
  })

  it('turns relative day and hour into a UTC datetime in the clinic time zone', async () => {
    const result = await nodeWith({
      intent: 'schedule',
      safetyAlert: false,
      relativeDay: 'tomorrow',
      hour: 10,
    })(state)

    assert.equal(result.intent, 'schedule')
    assert.equal(result.datetime, '2026-11-18T13:00:00.000Z')
    assert.equal('relativeDay' in result, false)
    assert.equal('hour' in result, false)
  })

  it('leaves the datetime empty when the time is missing', async () => {
    const result = await nodeWith({
      intent: 'schedule',
      safetyAlert: false,
      relativeDay: 'tomorrow',
    })(state)

    assert.equal(result.datetime, undefined)
  })

  it('does not trust a full datetime returned by the model', async () => {
    const result = await nodeWith({
      intent: 'schedule',
      safetyAlert: false,
      datetime: '2026-01-01T10:00:00.000Z',
    })(state)

    assert.equal(result.datetime, undefined)
  })

  it('sends the previous messages as history without the current question', async () => {
    const userPrompts: string[] = []

    await nodeWith({ intent: 'unknown', safetyAlert: false }, [], userPrompts)({
      messages: [
        new HumanMessage('Quero marcar com a Dra. Erica, CPF 11122233396'),
        new AIMessage('Qual dia e horário você prefere?'),
        new HumanMessage('amanhã às 12 horas'),
      ],
    })

    const payload = JSON.parse(userPrompts[0]!)
    assert.equal(payload.question, 'amanhã às 12 horas')
    assert.deepEqual(payload.conversation_history, [
      { role: 'user', content: 'Quero marcar com a Dra. Erica, CPF 11122233396' },
      { role: 'assistant', content: 'Qual dia e horário você prefere?' },
    ])
  })

  it('has no history field on the first message', async () => {
    const userPrompts: string[] = []

    await nodeWith({ intent: 'unknown', safetyAlert: false }, [], userPrompts)(state)

    assert.equal('conversation_history' in JSON.parse(userPrompts[0]!), false)
  })

  it('sends only the most recent messages and truncates long ones', async () => {
    const userPrompts: string[] = []
    const messages = Array.from({ length: 10 }, (_, index) =>
      index % 2 === 0
        ? new HumanMessage(`pergunta ${index} ${'x'.repeat(800)}`)
        : new AIMessage(`resposta ${index}`),
    )

    await nodeWith({ intent: 'unknown', safetyAlert: false }, [], userPrompts)({
      messages: [...messages, new HumanMessage('amanhã às 12 horas')],
    })

    const history = JSON.parse(userPrompts[0]!).conversation_history
    assert.equal(history.length, 6)
    assert.equal(history[0].content.startsWith('pergunta 4'), true)
    assert.equal(history[0].content.length, 500)
  })

  it('clears the details and the result of the previous run', async () => {
    const result = await nodeWith({ intent: 'unknown', safetyAlert: false })({
      messages: [new HumanMessage('amanhã às 12 horas')],
      actionSuccess: false,
      actionError: 'Appointment datetime is required',
      patientName: 'Lucas',
      patientCpf: '12345678909',
      doctorOptions: [{ name: 'Erica', crm: '1', specialty: 'Cardiologia' }],
    })

    for (const key of [
      'actionSuccess',
      'actionError',
      'patientName',
      'patientCpf',
      'doctorOptions',
      'appointmentData',
      'error',
    ] as const) {
      assert.equal(key in result, true, `${key} must be reset`)
      assert.equal(result[key], undefined)
    }
  })

  it('sends the local current date and weekday in the prompt', async () => {
    const prompts: string[] = []

    await nodeWith({ intent: 'unknown', safetyAlert: false }, prompts)(state)

    const prompt = JSON.parse(prompts[0]!)
    assert.deepEqual(prompt.current_date, {
      date: '2026-11-17',
      time: '09:44',
      weekday: 'tuesday',
      timeZone: 'America/Sao_Paulo',
    })
  })
})
