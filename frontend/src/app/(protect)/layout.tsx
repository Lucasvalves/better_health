import Header from './components/Header'
import styles from './page.module.scss'
import 'react-day-picker/dist/style.css'
import { AssistantChatProvider } from '@/presentation/providers/assistant-chat-provider'
import { AssistantWidget } from '@/presentation/components/AssistantChat/AssistantWidget'

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <AssistantChatProvider>
      <div className={styles.container}>
        <Header />
        <section className={styles.wrapper}>{children}</section>
      </div>
      <AssistantWidget />
    </AssistantChatProvider>
  )
}
