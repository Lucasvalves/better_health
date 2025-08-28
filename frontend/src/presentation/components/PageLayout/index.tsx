import { Condition } from '../Condition'
import Header from '../Header'
import styles from './page.module.scss'
import { enumsRoutes } from '@/shared/enums/enumsRoutes'

type PageLayoutProps = {
  title?: string
  userName?: string
  children?: React.ReactNode
  route?: string
}

export const PageLayout = ({
  title,
  userName,
  children,
  route
}: PageLayoutProps) => (
  <div className={styles.container}>
    <Header />
    <section className={styles.wrapper}>
      <div>
        <Condition when={route !== enumsRoutes.APPOINTMENTS}>
          <h2 className={styles.title}>{title}</h2>
        </Condition>
        <Condition when={route === enumsRoutes.APPOINTMENTS}>
          <p className={styles.title}>
            Bem Vinda, <span> {userName}!</span>
          </p>
          <p>inicie uma marcação!</p>
        </Condition>
        {children}
      </div>
    </section>
  </div>
)
