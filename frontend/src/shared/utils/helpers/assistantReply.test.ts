import { extractAssistantReply } from './assistantReply'

const message = (type: string, content: unknown) => ({
  lc: 1,
  type: 'constructor',
  id: ['langchain_core', 'messages', type],
  kwargs: { content }
})

describe('extractAssistantReply', () => {
  it('should return the content of the last assistant message', () => {
    const messages = [
      message('HumanMessage', 'oi'),
      message('AIMessage', '  Olá! Como posso ajudar?  ')
    ]

    expect(extractAssistantReply(messages)).toBe('Olá! Como posso ajudar?')
  })

  it('should return null when the last message is not from the assistant', () => {
    expect(extractAssistantReply([message('HumanMessage', 'oi')])).toBeNull()
  })

  it('should return null for empty or malformed messages', () => {
    expect(extractAssistantReply(undefined)).toBeNull()
    expect(extractAssistantReply([])).toBeNull()
    expect(extractAssistantReply([null])).toBeNull()
    expect(extractAssistantReply([message('AIMessage', '   ')])).toBeNull()
    expect(extractAssistantReply([message('AIMessage', [{}])])).toBeNull()
  })
})
