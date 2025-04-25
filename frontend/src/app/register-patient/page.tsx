import Form from "next/form";
import { ButtonGroup } from "../components/ButtonGroup";
import AppInput from "../components/Inputs/AppInput";
import { PageLayout } from "../components/PageLayout";
import styles from './page.module.scss'

export default function RegisterPatient(){
  return(
    <div className={styles.page}>
      <PageLayout title="Cadastrar Paciente" >
        <div className={styles.formWrapper}>
          <Form action="">
            <div className={styles.itemsCenter}>
            <AppInput label="Nome" placeholder="Pablo Rocha" className={styles.containerInput}/>
            <AppInput label="CPF" placeholder="000.000.00-00" className={styles.containerInput}/>
            <AppInput label="Telefone" placeholder="(71)99887-3114" className={styles.containerInput}/>
            <ButtonGroup rightButtonLabel="Cancelar" leftButtonLabel="Salvar" />
          </div>
          </Form>
        </div>
      </PageLayout>
    </div>
  )
}

