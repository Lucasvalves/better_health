import styles from './page.module.scss'
import AppInput from '@/presentation/components/Inputs/AppInput'
import { ButtonGroup } from '@/presentation/components/ButtonGroup'
import { useRegisterSpecialtyModel } from './register-specialty-model'

export default function RegisterSpecialtyView(methods: ReturnType<typeof useRegisterSpecialtyModel>) {

  const {
    handleCreateSpecialty,
    setSpecialtyName,
    specialtyName,
    handleReset
  } = methods

  return (
    <div className={styles.page}>
      <div>
        <p className={styles.title}>Cadastrar Especialidade</p>
      </div>
      <div className={styles.formWrapper}>
        <form onSubmit={handleCreateSpecialty}>
          <div className={styles.itemsCenter}>
            <AppInput
              label="Nome"
              placeholder="Oftamologista"
              className={styles.inputContainer}
              onChange={(e) => setSpecialtyName(e.target.value)}
              value={specialtyName}
            />
            <ButtonGroup
              rightButtonLabel="Cancelar"
              leftButtonLabel="Salvar"
              rightButtonClick={handleReset}
            />
          </div>
        </form>
      </div>
    </div>
  )
}
