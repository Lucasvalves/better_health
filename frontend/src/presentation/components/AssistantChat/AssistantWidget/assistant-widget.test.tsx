import { jest } from '@jest/globals'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderView } from '@/test/mock/react-query/renderScreen'
import { InMemorySendMessageService } from '@/test/mock/assistant-service/assistant'
import { AssistantChatProvider } from '@/presentation/providers/assistant-chat-provider'
import { AssistantWidget } from '.'

const mockUsePathname = jest.fn<() => string>()

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname()
}))

jest.mock('notistack', () => ({
  enqueueSnackbar: jest.fn()
}))

const renderWidget = () =>
  renderView(
    <AssistantChatProvider sendMessageService={new InMemorySendMessageService()}>
      <AssistantWidget />
    </AssistantChatProvider>
  )

describe('AssistantWidget', () => {
  it('should render minimized with the invitation title', () => {
    mockUsePathname.mockReturnValue('/appointments')
    renderWidget()

    expect(
      screen.getByText('Inicie um atendimento rápido com o Better Assistant')
    ).toBeVisible()
    expect(screen.queryByLabelText('Mensagem para o assistente')).toBeNull()
  })

  it('should expand and minimize again', async () => {
    mockUsePathname.mockReturnValue('/schedule')
    renderWidget()

    await userEvent.click(
      screen.getByRole('button', { name: 'Abrir chat do Better Assistant' })
    )
    expect(screen.getByLabelText('Mensagem para o assistente')).toBeVisible()

    await userEvent.click(screen.getByRole('button', { name: 'Minimizar chat' }))
    expect(screen.queryByLabelText('Mensagem para o assistente')).toBeNull()
  })

  it('should not render on the home page', () => {
    mockUsePathname.mockReturnValue('/')
    renderWidget()

    expect(
      screen.queryByText('Inicie um atendimento rápido com o Better Assistant')
    ).toBeNull()
  })
})
