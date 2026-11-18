import {
  SendMessageBody,
  SendMessageResponse
} from '@/domain/models/assistant'
import {
  HttpMethod,
  IHttpClient
} from '@/infrastructure/contratcs/http-contratcs'

export type SendMessageServiceContract = {
  exec: (body: SendMessageBody) => Promise<SendMessageResponse>
}

export class SendMessageService implements SendMessageServiceContract {
  private constructor(private readonly HttpClient: IHttpClient) {}

  static create(HttpClient: IHttpClient): SendMessageService {
    return new SendMessageService(HttpClient)
  }

  async exec(body: SendMessageBody): Promise<SendMessageResponse> {
    return this.HttpClient.sendRequest<SendMessageResponse, SendMessageBody>({
      endpoint: '/api/assistant',
      method: HttpMethod.POST,
      body,
      url: ''
    })
  }
}
