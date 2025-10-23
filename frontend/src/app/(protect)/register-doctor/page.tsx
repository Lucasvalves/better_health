import Form from 'next/form'
import styles from './page.module.scss'
import AppInput from '@/presentation/components/Inputs/AppInput'
import { ButtonGroup } from '@/presentation/components/ButtonGroup'

export default function RegisterPatient() {
  return (
    <div className={styles.page}>
      <div>
        <p className={styles.title}>Cadastrar Médico</p>
      </div>
      <div className={styles.formWrapper}>
        <Form action="">
          <div className={styles.itemsCenter}>
            <AppInput
              label="Nome"
              placeholder="Amanda Teixeira"
              className={styles.inputContainer}
            />
            <AppInput
              label="CRM"
              placeholder="1234"
              className={styles.inputContainer}
            />
            <AppInput
              label="Especialidade"
              placeholder="Oftamologista"
              className={styles.inputContainer}
            />
            <ButtonGroup rightButtonLabel="Cancelar" leftButtonLabel="Salvar" />
          </div>
        </Form>
      </div>
    </div>
  )
}
