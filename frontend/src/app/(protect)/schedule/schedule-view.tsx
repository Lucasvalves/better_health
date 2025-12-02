'use client'
import { ButtonGroup } from '@/presentation/components/ButtonGroup'
import AppInput from '@/presentation/components/Inputs/AppInput'
import styles from './page.module.scss'
import { DayPicker } from 'react-day-picker'
import { ptBR } from 'date-fns/locale'
import { isWeekend } from 'date-fns'
import { isPastDate, isWeekDay } from '@/shared/utils/helpers/calendarDate'
import { useScheduleModel } from './schedule-model'

export default function ScheduleView(
  methods: ReturnType<typeof useScheduleModel>
) {
  const {
    handleReset,
    setSelectedDate,
    setCRMFinal,
    setCRM,
    handdlCreateSchedule,
    setStartHour,
    setEndHour,
    selectedDate,
    doctor,
    crm,
    startHour,
    endHour
  } = methods

  return (
    <div className={styles.page}>
      <div>
        <p className={styles.title}>Montar Agenda</p>
      </div>
      <form onSubmit={handdlCreateSchedule}>
        <div className={styles.container}>
          <div className={styles.wrapperLeft}>
            <AppInput
              id="crm"
              label="Insira CRM do médico"
              placeholder="25267"
              type="text"
              onChange={(e) => setCRM(e.target.value)}
              value={crm}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  setCRMFinal(crm)
                }
              }}
            />
            <AppInput
              id="nameDoctor"
              label="Nome do médico"
              type="text"
              disabled
              value={doctor?.name || ''}
            />

            <AppInput
              id="specialty"
              label="Especialidade do médico"
              type="text"
              disabled
              value={doctor?.Specialties?.name || ''}
            />
            <AppInput
              id="startHour"
              label="Hora de inicio da agenda"
              type="time"
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
            />
            <AppInput
              id="endHour"
              label="Hora de fim da agenda"
              type="time"
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
            />
          </div>
          <div className={styles.wrapperRight}>
            <label htmlFor="specialties-select">Selecione a data</label>
            <div className={styles.picker}>
              <DayPicker
                mode="single"
                required={true}
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                fromMonth={new Date()}
                className={styles.calendar}
                modifiers={{
                  available: isWeekDay,
                  today: new Date()
                }}
                classNames={{
                  day: styles.day,
                  selected: styles.selected,
                  today: styles.today
                }}
                disabled={(date) => isPastDate(date) || isWeekend(date)}
              />
            </div>
          </div>
        </div>
        <div className={styles.wrapperCenter}>
          <ButtonGroup
            rightButtonClick={handleReset}
            rightButtonLabel="Cancelar"
            leftButtonLabel="Confirmar"
          />
        </div>
      </form>
    </div>
  )
}
