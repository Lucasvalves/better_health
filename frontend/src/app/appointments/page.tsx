import AppInput from "../components/Inputs/AppInput";
import { PageLayout } from "../components/PageLayout";
import { ROUTES } from "../paths";
import styles from './page.module.scss'

export default function EditProfile(){
  return(
    <div className={styles.page}>
      <PageLayout userName={"Eduarda Freitas"} route={ROUTES.APPOINTMENTS} />
      <section className={styles.container}>
        <div className={styles.wrapperLeft}>
            <AppInput label="Insira o nome  do paciente" placeholder="ex: joetracker@gmail.com" type="text"/>
            <AppInput label="Insira CPF do paciente" placeholder="ex: 12345678910" type="text"/>
          </div>
          <div className={styles.wrapperRight}>
        </div>
      </section>
    </div>
  )
}

