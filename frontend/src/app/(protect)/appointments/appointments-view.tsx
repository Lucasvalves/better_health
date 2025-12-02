'use client'
import { ButtonGroup } from '@/presentation/components/ButtonGroup'
import AppInput from '@/presentation/components/Inputs/AppInput'
import styles from './page.module.scss'
import { DayPicker } from 'react-day-picker'
import { ptBR } from 'date-fns/locale'
import { isPast, isWeekend } from 'date-fns'
import { useAppointmentsModel } from './appointments-model'
import { CustomSelect } from '@/presentation/components/CustomSelect'

export default function AppointmentsView(
  methods: ReturnType<typeof useAppointmentsModel>
) {
  const {
    setSelectedDate,
    setSelectedTime,
    handleReset,
    setCPF,
    setCPFFinal,
    setSpecialtyId,
    handleCreateAppointment,
    selectedDate,
    selectedTime,
    specialties,
    specialtyId,
    patient,
    cpf,
    normalizedAvailableDays,
    availableTimes,
    doctor,
    userName
  } = methods

  return (
    <div className={styles.page}>
      <div>
        <p className={styles.title}>
          Bem Vindo, <span> {userName || 'Usuário'}!</span>
        </p>
        <p className={styles.desc}>Inicie uma marcação!</p>
      </div>

      <form onSubmit={handleCreateAppointment}>
        <div className={styles.container}>
          <div className={styles.wrapperLeft}>
            <AppInput
              id="cpf"
              label="Insira CPF do paciente"
              placeholder="12345678910"
              type="text"
              onChange={(e) => setCPF(e.target.value)}
              value={cpf}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  setCPFFinal(cpf)
                }
              }}
            />
            <AppInput
              id="name"
              label="Nome do paciente"
              type="text"
              disabled
              value={patient?.name || ''}
            />
            <div className={styles.customSelect}>
              <CustomSelect
                value={specialtyId}
                options={specialties?.map((s) => ({
                  label: s.name,
                  value: s.id ?? ''
                }))}
                onChange={(value) => setSpecialtyId(value)}
                label="Especialidade"
              />
            </div>

            <AppInput
              id="name"
              label="Nome do medico"
              type="text"
              disabled
              value={doctor?.name || ''}
            />
          </div>
          <div className={styles.wrapperRight}>
            <label htmlFor="specialties-select">Selecione a data</label>
            <div className={styles.pickerContainer}>
              <div className={styles.picker}>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={ptBR}
                  classNames={{
                    day: styles.day,
                    selected: styles.selected,
                    today: styles.today
                  }}
                  disabled={(date) =>
                    isPast(date) ||
                    isWeekend(date) ||
                    !normalizedAvailableDays.some(
                      (d) => d.toDateString() === date.toDateString()
                    )
                  }
                />
              </div>

              <div className={styles.containerTime}>
                <div className={styles.timeList}>
                  <p>Horários Disponiveis</p>

                  {availableTimes.length === 0 && selectedDate && (
                    <p>Nenhum horário disponível neste dia.</p>
                  )}
                  {availableTimes.length === 0 &&
                    selectedDate === undefined && (
                      <p>Selecione uma especialidade.</p>
                    )}

                  <span>
                    {availableTimes.map((time) => (
                      <button
                        type="button"
                        key={time}
                        className={
                          time === selectedTime
                            ? styles.selectedTime
                            : styles.time
                        }
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.wrapperCenter}>
          <ButtonGroup
            rightButtonClick={handleReset}
            rightButtonLabel="Cancelar"
            leftButtonLabel="Agendar"
          />
        </div>
      </form>
    </div>
  )
}
