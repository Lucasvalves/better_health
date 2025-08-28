'use client'

import { useState } from 'react'
import styles from './page.module.scss'
import { DayPicker } from 'react-day-picker'
import { ptBR } from 'date-fns/locale'
import {
  isPastDate,
  isWeekDay,
  isWeekend
} from '@/shared/utils/helpers/calendarDate'
import { enumsRoutes } from '@/shared/enums/enumsRoutes'
import { PageLayout } from '@/presentation/components/PageLayout'
import AppInput from '@/presentation/components/Inputs/AppInput'
import { ButtonGroup } from '@/presentation/components/ButtonGroup'
export default function Schedule() {
  const [selectedDates, setSelectedDates] = useState<Date[]>([])

  return (
    <div className={styles.page}>
      <PageLayout route={enumsRoutes.SCHEDULE} title="Montar Agenda" />
      <section className={styles.container}>
        <div className={styles.wrapperLeft}>
          <AppInput
            label="Insira o nome  do médico"
            placeholder="Maiara Silva Costa"
            type="text"
          />
          <AppInput
            label="Insira CRM do médico"
            placeholder="25267"
            type="text"
          />
          <AppInput
            label="Especialidade do médico"
            placeholder="Clinica Geral"
            type="text"
          />
          <AppInput label="Quantidade de vagas" placeholder="5" type="number" />
        </div>
        <div className={styles.wrapperCenter}>
          <ButtonGroup
            rightButtonLabel="Cancelar"
            leftButtonLabel="Confirmar"
          />
        </div>
        <div className={styles.wrapperRight}>
          <label htmlFor="specialties-select">Selecione a data</label>
          <div className={styles.picker}>
            <DayPicker
              mode="multiple"
              required={true}
              selected={selectedDates}
              onSelect={setSelectedDates}
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
      </section>
    </div>
  )
}
