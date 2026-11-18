import { HttpMethod } from '@/infrastructure/contratcs/http-contratcs'
import { SendMessageBody } from '@/domain/models/assistant'
import { httpClientMockFail, httpClientMockSuccess } from '@/test/mock/httpMock'
import { SendMessageService } from './send-message-service'

const body: SendMessageBody = {
  question: 'Quero agendar uma consulta',
  history: [{ role: 'assistant', content: 'Olá!' }]
}

describe('SendMessageService', () => {
  it('should send the message to the assistant route and return the reply', async () => {
    const httpMock = httpClientMockSuccess({ reply: 'Claro!' })
    const service = SendMessageService.create(httpMock)

    const response = await service.exec(body)

    expect(response).toEqual({ reply: 'Claro!' })
    expect(httpMock.sendRequest).toHaveBeenCalled()
  })

  it('should call the internal assistant endpoint', async () => {
    const httpClient = {
      sendRequest: jest.fn().mockResolvedValue({ reply: 'Claro!' })
    }
    const service = SendMessageService.create(httpClient)

    await service.exec(body)

    expect(httpClient.sendRequest).toHaveBeenCalledWith({
      endpoint: '/api/assistant',
      method: HttpMethod.POST,
      body,
      url: ''
    })
  })

  it('should throw when the request fails', async () => {
    const httpMock = httpClientMockFail()
    const service = SendMessageService.create(httpMock)

    await expect(service.exec(body)).rejects.toThrow('Network error')
  })
})
