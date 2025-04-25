import Form from "next/form";
import { ButtonGroup } from "../components/ButtonGroup";
import AppInput from "../components/Inputs/AppInput";
import { PageLayout } from "../components/PageLayout";
import styles from './page.module.scss'

export default function RegisterPatient(){
  return(
    <div className={styles.page}>
      <PageLayout title="Cadastrar Especialidade" >
        <div className={styles.formWrapper}>
          <Form action="">
            <div className={styles.itemsCenter}>
            <AppInput label="Nome" placeholder="Oftamologista" className={styles.containerInput}/>
            <ButtonGroup rightButtonLabel="Cancelar" leftButtonLabel="Salvar" />
          </div>
          </Form>
        </div>
      </PageLayout>
    </div>
  )
}

