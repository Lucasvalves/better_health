'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { enqueueSnackbar } from 'notistack'
import {
  SendMessageService,
  SendMessageServiceContract
} from '@/data/assistant-service/send-message/send-message-service'
import { ChatMessage, SendMessageResponse } from '@/domain/models/assistant'
import { ASSISTANT_MAX_HISTORY } from '@/domain/validations/assistant-validation'
import { HttpClient } from '@/infrastructure/http/http-client'

type ApiError = {
  message?: string
}

type AssistantChatContextValue = {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  sendMessage: (question: string) => void
}

const AssistantChatContext = createContext<AssistantChatContextValue | null>(
  null
)

const DEFAULT_ERROR = 'Não foi possível falar com o assistente agora.'

type Props = {
  children: React.ReactNode
  sendMessageService?: SendMessageServiceContract
}

export const AssistantChatProvider = ({
  children,
  sendMessageService
}: Props) => {
  const service = useMemo(
    () => sendMessageService ?? SendMessageService.create(HttpClient.create()),
    [sendMessageService]
  )

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const nextId = useRef(0)

  const createMessage = useCallback(
    (role: ChatMessage['role'], content: string): ChatMessage => {
      nextId.current += 1
      return { id: `message-${nextId.current}`, role, content }
    },
    []
  )

  const { mutate, isPending } = useMutation<
    SendMessageResponse,
    AxiosError<ApiError>,
    { question: string; history: ChatMessage[] }
  >({
    mutationFn: ({ question, history }) =>
      service.exec({
        question,
        history: history.map(({ role, content }) => ({ role, content }))
      }),
    onSuccess: ({ reply }) => {
      setMessages((current) => [...current, createMessage('assistant', reply)])
    },
    onError: (err) => {
      const message = err.response?.data?.message || DEFAULT_ERROR
      setError(message)
      enqueueSnackbar(message, { variant: 'error' })
    }
  })

  const sendMessage = useCallback(
    (question: string) => {
      const trimmed = question.trim()
      if (!trimmed || isPending) return

      const history = messages.slice(-ASSISTANT_MAX_HISTORY)

      setError(null)
      setMessages((current) => [...current, createMessage('user', trimmed)])
      mutate({ question: trimmed, history })
    },
    [messages, isPending, mutate, createMessage]
  )

  const value = useMemo(
    () => ({
      messages,
      isLoading: isPending,
      error,
      isOpen,
      setIsOpen,
      sendMessage
    }),
    [messages, isPending, error, isOpen, sendMessage]
  )

  return (
    <AssistantChatContext.Provider value={value}>
      {children}
    </AssistantChatContext.Provider>
  )
}

export const useAssistantChat = () => {
  const context = useContext(AssistantChatContext)

  if (!context) {
    throw new Error('useAssistantChat must be used within AssistantChatProvider')
  }

  return context
}
