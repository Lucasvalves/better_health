"use client"
import { enumsRoutes } from "@/shared/enums/enumsRoutes";

import styles from './page.module.scss'
import 'react-day-picker/dist/style.css';
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { PageLayout } from "@/presentation/components/PageLayout";
import AppInput from "@/presentation/components/Inputs/AppInput";

export default function SearchAppointments() {

  return (
    <div className={styles.page}>
      <PageLayout userName={"Eduarda Freitas"} route={enumsRoutes.APPOINTMENTS} />
      <section className={styles.container}>
        <div className={styles.wrapperTop}>
          <AppInput label="Insira CPF do paciente" placeholder="12345678910" type="text" />
          <AppInput label="Insira a data" placeholder="00/00/00" type="text" />
        </div>
        <div className={styles.wrapperTable}>
          <table className={styles.tabelAppointments}>
            <thead>
              <tr>
                <th>Horário</th>
                <th>Especialidade</th>
                <th>Médico</th>
                <th>CRM</th>
              </tr>
            </thead>
            <tbody>
              {[
                { horario: '10h', especialidade: 'Clínico Geral', medico: 'Maiara Maraisa', crm: '25267' },
                { horario: '11h', especialidade: 'Urologista', medico: 'Simone Simaria', crm: '12893' },
                { horario: '12h', especialidade: 'Cardiologista', medico: 'Marília Mendonça', crm: '20283' },
                { horario: '12h', especialidade: 'Cardiologista', medico: 'Marília Mendonça', crm: '20283' },
                { horario: '13h', especialidade: 'Dermatologista', medico: 'Ana Castela', crm: '449378' },
                { horario: '14h', especialidade: 'Angiologista', medico: 'Lauana Prado', crm: '937786' },
              ].map((item, i) => (
                <tr key={i} className={styles.linha}>
                <td className={styles.time}>{item.horario}</td>
                <td className={styles.specialty}>{item.especialidade}</td>
                <td className={styles.doctor}>{item.medico}</td>
                <td className={styles.crm}>
                  <span className={styles.crmNumber}>{item.crm}</span>
                  <span className={styles.actions}>
                    <button className={styles.edit} title="Editar"><MdOutlineEdit /></button>
                    <button className={styles.delete} title="Excluir"><RiDeleteBin6Line /></button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </section >
    </div >
  )
}

