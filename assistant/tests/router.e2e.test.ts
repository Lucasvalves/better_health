import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { AIMessage, HumanMessage } from 'langchain'
import { createServer } from '../src/server.ts'

describe('POST /chat', () => {
  it('rejects requests without token', async () => {
    const app = createServer({
      buildGraph: () => {
        throw new Error('should not build graph without token')
      },
    })

    const response = await app.inject({
      method: 'POST',
      url: '/chat',
      payload: {
        question: 'Quero agendar uma consulta amanhã às 16h',
      },
    })

    assert.equal(response.statusCode, 400)
  })

  it('invokes graph with token and returns sanitized payload', async () => {
    let receivedToken: string | undefined

    const app = createServer({
      buildGraph: (token: string) => {
        receivedToken = token
        return {
          invoke: async () => ({
            intent: 'schedule',
            actionSuccess: true,
            doctorName: 'Dr. Test',
            datetime: '2026-02-12T16:00:00.000Z',
            patientName: 'Maria Santos',
            appointmentData: { id: 'appt-1' },
            messages: [
              new HumanMessage('agendar'),
              new AIMessage('Consulta confirmada.'),
            ],
          }),
        } as unknown as ReturnType<typeof import('../src/graph/factory.ts').buildGraph>
      },
    })

    const response = await app.inject({
      method: 'POST',
      url: '/chat',
      payload: {
        question: 'Quero agendar uma consulta amanhã às 16h',
        token: 'jwt-from-better-health',
      },
    })

    assert.equal(response.statusCode, 200)
    assert.equal(receivedToken, 'jwt-from-better-health')

    const body = JSON.parse(response.body)
    assert.equal(body.intent, 'schedule')
    assert.equal(body.actionSuccess, true)
    assert.equal(body.appointmentData.id, 'appt-1')
    assert.equal(body.token, undefined)
  })
})
