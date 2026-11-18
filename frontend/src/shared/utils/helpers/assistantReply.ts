type SerializedMessage = {
  id?: unknown
  kwargs?: { content?: unknown }
}

const isAssistantMessage = (message: SerializedMessage): boolean =>
  Array.isArray(message.id) &&
  message.id[message.id.length - 1] === 'AIMessage'

export const extractAssistantReply = (messages: unknown): string | null => {
  if (!Array.isArray(messages) || messages.length === 0) return null

  const last = messages[messages.length - 1] as SerializedMessage | null
  if (!last || typeof last !== 'object' || !isAssistantMessage(last)) {
    return null
  }

  const content = last.kwargs?.content
  if (typeof content !== 'string') return null

  const reply = content.trim()
  return reply.length > 0 ? reply : null
}
