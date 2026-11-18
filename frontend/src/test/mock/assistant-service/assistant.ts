import { SendMessageServiceContract } from '@/data/assistant-service/send-message/send-message-service'
import { SendMessageBody, SendMessageResponse } from '@/domain/models/assistant'

export class InMemorySendMessageService implements SendMessageServiceContract {
  public received: SendMessageBody[] = []

  async exec(body: SendMessageBody): Promise<SendMessageResponse> {
    this.received.push(body)
    return { reply: `Resposta para: ${body.question}` }
  }
}

export class FailingSendMessageService implements SendMessageServiceContract {
  async exec(): Promise<SendMessageResponse> {
    throw new Error('Network error')
  }
}
