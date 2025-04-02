import { ROUTES } from "@/app/paths";
import { Condition } from "../Condition";
import Header from "../Header";
import styles from './page.module.scss'

type PageLayoutProps = {
  title?: string;
  userName?: string;
  children?: React.ReactNode;
  route?: string;
}

export const PageLayout = ({ title, userName, children, route }: PageLayoutProps) => (
  <div className={styles.container}>
   <Header/>
    <section className={styles.wrapper}>
      <div>
        <Condition when={route !== ROUTES.APPOINTMENTS}>
          <h2 className={styles.title}>{title}</h2>
        </Condition>
        <Condition when={route === ROUTES.APPOINTMENTS}>
        <p className={styles.title}>Bem Vinda, <span> {userName}!</span></p>
          <p>inicie uma  marcação!</p>
        </Condition>
        {children}
      </div>
    </section>
  </div>
);