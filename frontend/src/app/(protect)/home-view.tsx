'use client'

import Link from 'next/link'
import { MdAutoAwesome, MdEventAvailable, MdEventBusy } from 'react-icons/md'
import { ChatPanel } from '@/presentation/components/AssistantChat/ChatPanel'
import { enumsRoutes } from '@/shared/enums/enumsRoutes'
import { useHomeModel } from './home-model'
import styles from './home.module.scss'

export default function HomeView(methods: ReturnType<typeof useHomeModel>) {
  const { userName } = methods

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.badge}>
          <MdAutoAwesome size={16} />
          Novidade
        </span>
        <p className={styles.title}>
          Bem Vindo, <span>{userName || 'Usuário'}!</span>
        </p>
        <h1 className={styles.headline}>
          Conheça o <span>Better Assistant</span>
        </h1>
        <p className={styles.desc}>
          Agende ou cancele consultas apenas conversando. Diga o paciente, o
          médico e o horário, e o assistente faz o resto.
        </p>

        <ul className={styles.features}>
          <li>
            <MdEventAvailable size={22} />
            <span>Agendamento a partir de uma frase</span>
          </li>
          <li>
            <MdEventBusy size={22} />
            <span>Cancelamento rápido e seguro</span>
          </li>
        </ul>

        <Link href={enumsRoutes.APPOINTMENTS} className={styles.link}>
          Prefere o formulário? Realizar agendamento
        </Link>
      </div>

      <div className={styles.chat}>
        <ChatPanel variant="page" />
      </div>
    </div>
  )
}
