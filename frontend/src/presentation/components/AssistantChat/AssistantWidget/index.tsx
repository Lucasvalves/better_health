'use client'

import { usePathname } from 'next/navigation'
import { MdSmartToy } from 'react-icons/md'
import { enumsRoutes } from '@/shared/enums/enumsRoutes'
import { useAssistantChat } from '@/presentation/providers/assistant-chat-provider'
import { ChatPanel } from '../ChatPanel'
import styles from './page.module.scss'

export const AssistantWidget = () => {
  const pathname = usePathname()
  const { isOpen, setIsOpen } = useAssistantChat()

  if (pathname === enumsRoutes.HOME) return null

  return (
    <div className={styles.widget}>
      {isOpen ? (
        <div className={styles.window}>
          <ChatPanel variant="widget" onMinimize={() => setIsOpen(false)} />
        </div>
      ) : (
        <button
          type="button"
          className={styles.minimized}
          onClick={() => setIsOpen(true)}
          aria-label="Abrir chat do Better Assistant"
        >
          <span className={styles.icon}>
            <MdSmartToy size={22} />
          </span>
          <span className={styles.title}>
            Inicie um atendimento rápido com o Better Assistant
          </span>
        </button>
      )}
    </div>
  )
}
