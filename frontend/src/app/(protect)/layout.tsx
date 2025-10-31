import Header from './components/Header'
import styles from './page.module.scss'
import 'react-day-picker/dist/style.css'

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <Header />
      <section className={styles.wrapper}>{children}</section>
    </div>
  )
}
