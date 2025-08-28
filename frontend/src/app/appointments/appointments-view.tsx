'use client'
import { ButtonGroup } from '../../presentation/components/ButtonGroup'
import AppInput from '../../presentation/components/Inputs/AppInput'
import { PageLayout } from '../../presentation/components/PageLayout'
import styles from './page.module.scss'
import { DayPicker } from 'react-day-picker'
import { ptBR } from 'date-fns/locale'
import { format, isWeekend } from 'date-fns'
import { isPastDate, isWeekDay } from '@/shared/utils/helpers/calendarDate'
import { enumsRoutes } from '@/shared/enums/enumsRoutes'
import { useAppointmentsModel } from './appointments-model'

export default function AppointmentsView(
  methods: ReturnType<typeof useAppointmentsModel>
) {
  const { selectedDate, setSelectedDate, selectedTime, setSelectedTime } =
    methods

  return (
    <div className={styles.page}>
      <PageLayout
        userName={'Eduarda Freitas'}
        route={enumsRoutes.APPOINTMENTS}
      />
      <section className={styles.container}>
        <div className={styles.wrapperLeft}>
          <AppInput
            label="Insira o nome  do paciente"
            placeholder="joetracker@gmail.com"
            type="text"
          />
          <AppInput
            label="Insira CPF do paciente"
            placeholder="12345678910"
            type="text"
          />
          <div>
            <label htmlFor="specialties-select">
              Selecione uma especialidade
            </label>
            <div className={styles.specialtiesSelect}>
              <select id="specialties-select" name="specialties">
                {/* <option disabled selectedDate hidden>Selecione...</option> */}
                <option value="dermatologista">Dermatologista</option>
                <option value="urologista">Urologista</option>
                <option value="cardiologista">Cardiologista</option>
                <option value="clinicoGeral">Clínico Geral</option>
                <option value="angiologista">Angiologista</option>
              </select>
            </div>
          </div>
        </div>
        <div className={styles.wrapperCenter}>
          <ButtonGroup rightButtonLabel="Cancelar" leftButtonLabel="Agendar" />
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
              <div className={styles.time}>
                <p>Horários Disponiveis</p>
                <ul>
                  {[
                    { horario: '01h' },
                    { horario: '02h' },
                    { horario: '03h' },
                    { horario: '04h' },
                    { horario: '05h' },
                    { horario: '06h' },
                    { horario: '07h' },
                    { horario: '08h' },
                    { horario: '09h' },
                    { horario: '10h' },
                    { horario: '11h' },
                    { horario: '12h' },
                    { horario: '13h' },
                    { horario: '14h' },
                    { horario: '15h' },
                    { horario: '16h' },
                    { horario: '17h' },
                    { horario: '18h' },
                    { horario: '19h' },
                    { horario: '20h' },
                    { horario: '21h' },
                    { horario: '22h' },
                    { horario: '23h' },
                    { horario: '24h' }
                  ].map((item, i) => (
                    <li
                      key={i}
                      className={
                        selectedTime === item.horario ? styles.selectedTime : ''
                      }
                      onClick={(e) => {
                        e.preventDefault()
                        setSelectedTime(item.horario)
                      }}
                    >
                      {item.horario}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p>
              {selectedDate
                ? `Horario: ${format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })} ${selectedTime}`
                : `Hoje ${selectedTime}`}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
