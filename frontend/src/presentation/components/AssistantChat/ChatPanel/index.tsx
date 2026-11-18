'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { MdRemove, MdSend, MdSmartToy } from 'react-icons/md'
import { useAssistantChat } from '@/presentation/providers/assistant-chat-provider'
import { ASSISTANT_MAX_MESSAGE_LENGTH } from '@/domain/validations/assistant-validation'
import styles from './page.module.scss'

type Props = {
  variant?: 'page' | 'widget'
  onMinimize?: () => void
}

const SUGGESTIONS = [
  'Quero agendar uma consulta',
  'Quero cancelar uma consulta'
]

export const ChatPanel = ({ variant = 'page', onMinimize }: Props) => {
  const { messages, isLoading, error, sendMessage } = useAssistantChat()
  const [text, setText] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages, isLoading])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim() || isLoading) return
    sendMessage(text)
    setText('')
  }

  return (
    <section
      className={`${styles.panel} ${styles[variant]}`}
      aria-label="Better Assistant"
    >
      <header className={styles.header}>
        <span className={styles.avatar}>
          <MdSmartToy size={22} />
        </span>
        <div className={styles.headerText}>
          <strong>Better Assistant</strong>
          <span>Agende ou cancele consultas conversando</span>
        </div>
        {onMinimize && (
          <button
            type="button"
            className={styles.minimize}
            onClick={onMinimize}
            aria-label="Minimizar chat"
          >
            <MdRemove size={22} />
          </button>
        )}
      </header>

      <div className={styles.messages} ref={listRef} aria-live="polite">
        {messages.length === 0 && (
          <div className={styles.empty}>
            <p>Olá! Como posso ajudar você hoje?</p>
            <div className={styles.suggestions}>
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  disabled={isLoading}
                  onClick={() => sendMessage(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.bubble} ${
              message.role === 'user' ? styles.user : styles.assistant
            }`}
          >
            {message.content}
          </div>
        ))}

        {isLoading && (
          <div
            className={`${styles.bubble} ${styles.assistant} ${styles.typing}`}
            aria-label="Assistente digitando"
          >
            <span />
            <span />
            <span />
          </div>
        )}

        {error && !isLoading && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          maxLength={ASSISTANT_MAX_MESSAGE_LENGTH}
          placeholder="Digite sua mensagem..."
          aria-label="Mensagem para o assistente"
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          aria-label="Enviar mensagem"
        >
          <MdSend size={20} />
        </button>
      </form>
    </section>
  )
}
