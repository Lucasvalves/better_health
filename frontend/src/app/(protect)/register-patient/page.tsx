import Form from 'next/form'
import styles from './page.module.scss'
import { ButtonGroup } from '@/presentation/components/ButtonGroup'
import AppInput from '@/presentation/components/Inputs/AppInput'

export default function RegisterPatient() {
  return (
    <div className={styles.page}>
        <div>
          <p className={styles.title}>Cadastrar Paciente</p>
        </div>
        <div className={styles.formWrapper}>
          <Form action="">
            <div className={styles.itemsCenter}>
              <AppInput
                label="Nome"
                placeholder="Pablo Rocha"
                className={styles.inputContainer}
              />
              <AppInput
                label="CPF"
                placeholder="000.000.00-00"
                className={styles.inputContainer}
              />
              <AppInput
                label="Telefone"
                placeholder="(71)99887-3114"
                className={styles.inputContainer}
              />
              <ButtonGroup
                rightButtonLabel="Cancelar"
                leftButtonLabel="Salvar"
              />
            </div>
          </Form>
        </div>
    </div>
  )
}
