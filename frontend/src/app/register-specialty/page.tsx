import Form from 'next/form'
import styles from './page.module.scss'
import { PageLayout } from '@/presentation/components/PageLayout'
import AppInput from '@/presentation/components/Inputs/AppInput'
import { ButtonGroup } from '@/presentation/components/ButtonGroup'

export default function RegisterPatient() {
  return (
    <div className={styles.page}>
      <PageLayout title="Cadastrar Especialidade">
        <div className={styles.formWrapper}>
          <Form action="">
            <div className={styles.itemsCenter}>
              <AppInput
                label="Nome"
                placeholder="Oftamologista"
                className={styles.inputContainer}
              />
              <ButtonGroup
                rightButtonLabel="Cancelar"
                leftButtonLabel="Salvar"
              />
            </div>
          </Form>
        </div>
      </PageLayout>
    </div>
  )
}
