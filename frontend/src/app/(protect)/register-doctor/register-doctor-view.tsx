import styles from './page.module.scss'
import AppInput from '@/presentation/components/Inputs/AppInput'
import { ButtonGroup } from '@/presentation/components/ButtonGroup'
import { useRegisterDoctorModel } from './register-doctor-model'
import { maskCRM } from '@/shared/utils/helpers/mask'
import { CustomSelect } from '@/presentation/components/CustomSelect'

export default function RegisterDoctorView(
  methods: ReturnType<typeof useRegisterDoctorModel>
) {
  const {
    handleCreateDoctor,
    handleReset,
    setCreateDoctorPayload,
    createDoctorPayload,
    specialties
  } = methods

  return (
    <div className={styles.page}>
      <div>
        <p className={styles.title}>Cadastrar Médico</p>
      </div>
      <div className={styles.formWrapper}>
        <form onSubmit={handleCreateDoctor}>
          <div className={styles.itemsCenter}>
            <AppInput
              id="name"
              label="Nome"
              placeholder="Amanda Teixeira"
              className={styles.inputContainer}
              onChange={(e) =>
                setCreateDoctorPayload({
                  ...createDoctorPayload,
                  name: e.target.value
                })
              }
              value={createDoctorPayload.name}
            />
            <AppInput
              id="crm"
              label="CRM"
              placeholder="1234"
              className={styles.inputContainer}
              onChange={(e) =>
                setCreateDoctorPayload({
                  ...createDoctorPayload,
                  crm: maskCRM(e.target.value)
                })
              }
              value={createDoctorPayload.crm}
            />
            <CustomSelect
              value={createDoctorPayload.specialties_id}
              options={specialties?.map((s) => ({
                label: s.name,
                value: s.id ?? ''
              }))}
              onChange={(value) =>
                setCreateDoctorPayload({
                  ...createDoctorPayload,
                  specialties_id: value
                })
              }
              label="Especialidade"
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
