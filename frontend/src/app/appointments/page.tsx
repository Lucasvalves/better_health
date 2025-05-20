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
import { format } from 'date-fns'

export default function Appointments(){
  const [selected, setSelected] = useState<Date>();
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };
  const isWeekDay = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  return(
    <div className={styles.page}>
      <PageLayout userName={"Eduarda Freitas"} route={ROUTES.APPOINTMENTS} />
      <section className={styles.container}>
        <div className={styles.wrapperLeft}>
            <AppInput label="Insira o nome  do paciente" placeholder="joetracker@gmail.com" type="text"/>
            <AppInput label="Insira CPF do paciente" placeholder="12345678910" type="text"/>
            <div>
              <label htmlFor="specialties-select">Selecione uma especialidade</label>
              <div className={styles.specialtiesSelect}>
                <select id="specialties-select" name="specialties">
                  {/* <option disabled selected hidden>Selecione...</option> */}
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
            <ButtonGroup rightButtonLabel="Cancelar" leftButtonLabel="Agendar"/>
          </div>
          <div className={styles.wrapperRight}>
            <label htmlFor="specialties-select">Selecione o horário</label>
            <div className={styles.picker}>
              <DayPicker
                mode="single"
                selected={selected}
                onSelect={setSelected}
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
                disabled={isWeekend}
                footer={
                  <p style={{ textAlign: "center", marginTop: "1rem" }}>
                   {selected ? `Selecionado: ${format(selected, "dd/MM/yyyy", { locale: ptBR })}` : "Hoje"}
                  </p>
                }
              />
            </div>
          </div>
      </section>
    </div>
  )
}

