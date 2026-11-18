export type ChatRole = 'user' | 'assistant'

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
}

export type AssistantHistoryItem = Pick<ChatMessage, 'role' | 'content'>

export type SendMessageBody = {
  question: string
  history: AssistantHistoryItem[]
}

export type SendMessageResponse = {
  reply: string
}
