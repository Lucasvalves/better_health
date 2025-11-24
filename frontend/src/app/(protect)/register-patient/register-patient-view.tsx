import styles from './page.module.scss'
import AppInput from '@/presentation/components/Inputs/AppInput'
import { ButtonGroup } from '@/presentation/components/ButtonGroup'
import { useRegisterPatientModel } from './register-patient-model'
import { maskCPF, maskPhone } from '@/shared/utils/helpers/mask'

export default function RegisterPatientView(
  methods: ReturnType<typeof useRegisterPatientModel>
) {
  const {
    handleCreatePatient,
    handleReset,
    setCreatePatientPayload,
    createPatientPayload
  } = methods

  return (
    <div className={styles.page}>
      <div>
        <p className={styles.title}>Cadastrar Paciente</p>
      </div>
      <div className={styles.formWrapper}>
        <form onSubmit={handleCreatePatient}>
          <div className={styles.itemsCenter}>
            <AppInput
              id="name"
              label="Nome"
              placeholder="Pablo Rocha"
              className={styles.inputContainer}
              onChange={(e) =>
                setCreatePatientPayload({
                  ...createPatientPayload,
                  name: e.target.value
                })
              }
              value={createPatientPayload.name}
            />
            <AppInput
              id="cpf"
              label="CPF"
              placeholder="000.000.00-00"
              className={styles.inputContainer}
              onChange={(e) =>
                setCreatePatientPayload({
                  ...createPatientPayload,
                  cpf: maskCPF(e.target.value)
                })
              }
              value={createPatientPayload.cpf}
            />
            <AppInput
              id="phone"
              label="Telefone"
              placeholder="(71)99887-3114"
              className={styles.inputContainer}
              onChange={(e) =>
                setCreatePatientPayload({
                  ...createPatientPayload,
                  phone: maskPhone(e.target.value)
                })
              }
              value={createPatientPayload.phone}
            />
            <ButtonGroup
              rightButtonClick={handleReset}
              rightButtonLabel="Cancelar"
              leftButtonLabel="Salvar"
            />
          </div>
        </form>
      </div>
    </div>
  )
}
