import { jest } from '@jest/globals'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderView } from '@/test/mock/react-query/renderScreen'
import {
  FailingSendMessageService,
  InMemorySendMessageService
} from '@/test/mock/assistant-service/assistant'
import { SendMessageServiceContract } from '@/data/assistant-service/send-message/send-message-service'
import { AssistantChatProvider } from '@/presentation/providers/assistant-chat-provider'
import { ChatPanel } from '.'

jest.mock('notistack', () => ({
  enqueueSnackbar: jest.fn()
}))

const renderPanel = (service: SendMessageServiceContract) =>
  renderView(
    <AssistantChatProvider sendMessageService={service}>
      <ChatPanel />
    </AssistantChatProvider>
  )

describe('ChatPanel', () => {
  it('should show the empty state with suggestions', () => {
    renderPanel(new InMemorySendMessageService())

    expect(screen.getByText('Olá! Como posso ajudar você hoje?')).toBeVisible()
    expect(
      screen.getByRole('button', { name: 'Quero agendar uma consulta' })
    ).toBeVisible()
  })

  it('should disable send while the input is empty', () => {
    renderPanel(new InMemorySendMessageService())

    expect(
      screen.getByRole('button', { name: 'Enviar mensagem' })
    ).toBeDisabled()
  })

  it('should send a message and show the assistant reply', async () => {
    const service = new InMemorySendMessageService()
    renderPanel(service)

    await userEvent.type(
      screen.getByLabelText('Mensagem para o assistente'),
      'Cancelar consulta{enter}'
    )

    expect(screen.getByText('Cancelar consulta')).toBeVisible()
    expect(
      await screen.findByText('Resposta para: Cancelar consulta')
    ).toBeVisible()
    expect(service.received[0]).toEqual({
      question: 'Cancelar consulta',
      history: []
    })
  })

  it('should send the previous messages as history', async () => {
    const service = new InMemorySendMessageService()
    renderPanel(service)
    const input = screen.getByLabelText('Mensagem para o assistente')

    await userEvent.type(input, 'Primeira{enter}')
    await screen.findByText('Resposta para: Primeira')
    await userEvent.type(input, 'Segunda{enter}')
    await screen.findByText('Resposta para: Segunda')

    expect(service.received[1].history).toEqual([
      { role: 'user', content: 'Primeira' },
      { role: 'assistant', content: 'Resposta para: Primeira' }
    ])
  })

  it('should send a suggestion when clicked', async () => {
    const service = new InMemorySendMessageService()
    renderPanel(service)

    await userEvent.click(
      screen.getByRole('button', { name: 'Quero agendar uma consulta' })
    )

    expect(
      await screen.findByText('Resposta para: Quero agendar uma consulta')
    ).toBeVisible()
  })

  it('should show an error when the assistant fails', async () => {
    renderPanel(new FailingSendMessageService())

    await userEvent.type(
      screen.getByLabelText('Mensagem para o assistente'),
      'Olá{enter}'
    )

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Não foi possível falar com o assistente agora.'
      )
    )
  })

  it('should call onMinimize from the minimize button', async () => {
    const onMinimize = jest.fn()
    renderView(
      <AssistantChatProvider sendMessageService={new InMemorySendMessageService()}>
        <ChatPanel variant="widget" onMinimize={onMinimize} />
      </AssistantChatProvider>
    )

    await userEvent.click(screen.getByRole('button', { name: 'Minimizar chat' }))

    expect(onMinimize).toHaveBeenCalledTimes(1)
  })
})
