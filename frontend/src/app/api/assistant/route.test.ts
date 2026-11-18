/**
 * @jest-environment node
 */
import { jest } from '@jest/globals'
import { POST } from './route'

const mockGet = jest.fn<(name: string) => { value: string } | undefined>()

jest.mock('next/headers', () => ({
  cookies: async () => ({ get: (name: string) => mockGet(name) })
}))

const request = (body: unknown) =>
  new Request('http://localhost/api/assistant', {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body)
  })

const assistantResponse = (messages: unknown, status = 200) =>
  new Response(JSON.stringify({ messages }), { status })

const aiMessage = (content: string) => ({
  id: ['langchain_core', 'messages', 'AIMessage'],
  kwargs: { content }
})

describe('POST /api/assistant', () => {
  const fetchMock = jest.fn<typeof fetch>()

  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = fetchMock
    mockGet.mockReturnValue({ value: 'jwt-token' })
  })

  it('should return 401 without a token cookie', async () => {
    mockGet.mockReturnValue(undefined)

    const response = await POST(request({ question: 'oi' }))

    expect(response.status).toBe(401)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('should return 400 for an invalid body', async () => {
    expect((await POST(request({ question: '' }))).status).toBe(400)
    expect((await POST(request('not-json'))).status).toBe(400)
    expect(
      (
        await POST(
          request({
            question: 'oi',
            history: Array.from({ length: 11 }, () => ({
              role: 'user',
              content: 'x'
            }))
          })
        )
      ).status
    ).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('should forward the question, history and token and return the reply', async () => {
    fetchMock.mockResolvedValue(assistantResponse([aiMessage('Agendado!')]))

    const response = await POST(
      request({
        question: 'Agendar',
        history: [{ role: 'assistant', content: 'Olá' }]
      })
    )

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ reply: 'Agendado!' })

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('http://localhost:3001/chat')
    expect(JSON.parse(String(init?.body))).toEqual({
      question: 'Agendar',
      history: [{ role: 'assistant', content: 'Olá' }],
      token: 'jwt-token'
    })
  })

  it('should map an assistant 401 to 401', async () => {
    fetchMock.mockResolvedValue(new Response('{}', { status: 401 }))

    expect((await POST(request({ question: 'oi' }))).status).toBe(401)
  })

  it('should return a generic 502 when the assistant fails or is unreachable', async () => {
    fetchMock.mockResolvedValueOnce(new Response('boom', { status: 500 }))
    const failed = await POST(request({ question: 'oi' }))
    expect(failed.status).toBe(502)
    expect(await failed.json()).toEqual({
      message: 'Não foi possível falar com o assistente agora.'
    })

    fetchMock.mockRejectedValueOnce(new Error('ECONNREFUSED'))
    expect((await POST(request({ question: 'oi' }))).status).toBe(502)
  })

  it('should return 502 when the reply cannot be extracted', async () => {
    fetchMock.mockResolvedValue(assistantResponse([]))

    expect((await POST(request({ question: 'oi' }))).status).toBe(502)
  })
})
