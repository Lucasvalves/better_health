"use client"

import { useState } from "react";
import { ButtonGroup } from "../components/ButtonGroup";
import AppInput from "../components/Inputs/AppInput";
import { PageLayout } from "../components/PageLayout";
import { ROUTES } from "../paths";
import styles from './page.module.scss'
import { DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css';
import { ptBR } from 'date-fns/locale';

export default function Schedule() {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };
  const isWeekDay = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove a parte de horas para comparar apenas datas
    return date < today;
  };

  return (
    <div className={styles.page}>
      <PageLayout route={ROUTES.SCHEDULE} title="Montar Agenda" />
      <section className={styles.container}>
        <div className={styles.wrapperLeft}>
          <AppInput label="Insira o nome  do médico" placeholder="Maiara Silva Costa" type="text" />
          <AppInput label="Insira CRM do médico" placeholder="25267" type="text" />
          <AppInput label="Especialidade do médico" placeholder="Clinica Geral" type="text" />
          <AppInput label="Quantidade de vagas" placeholder="5" type="number" />
        </div>
        <div className={styles.wrapperCenter}>
          <ButtonGroup rightButtonLabel="Cancelar" leftButtonLabel="Confirmar" />
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
                today: new Date(),
              }}
              classNames={{
                day: styles.day,
                selected: styles.selected,
                today: styles.today,
              }}
              disabled={(date) => isPastDate(date) || isWeekend(date)}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

