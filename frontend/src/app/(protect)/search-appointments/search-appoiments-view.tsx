'use client'
import styles from './page.module.scss'
import 'react-day-picker/dist/style.css'
import { MdOutlineEdit } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'
import AppInput from '@/presentation/components/Inputs/AppInput'
import { useSearchAppointmentsModel } from './search-appoiments-model'
import { RiResetRightLine } from 'react-icons/ri'
import { format } from 'date-fns'
import { ModalEditAppointment } from '@/app/(protect)/search-appointments/modal-edit-appointment'
import { ModalDeleteAppointment } from './modal-delete-appointment'
import { AppointmentsPatientResponse } from '@/domain/models/appointment'

export default function SearchAppointmentsView(
  methods: ReturnType<typeof useSearchAppointmentsModel>
) {
  const {
    setCPF,
    setCPFFinal,
    handleReset,
    cpf,
    patient,
    appointmentsPatient,
    isOpenModalEdit,
    setOpenModalEdit,
    userName,
    isOpenModalDelete,
    setOpenModalDelete,
    handleDeleteAppointment,
    setAppointmentToDelete,
    setAppointmentToUpdate,
    appointmentToUpdate,
    handleUpdateAppointment
  } = methods

  return (
    <div className={styles.page}>
      <div>
        <span className={styles.title}>
          Olá, <span> {userName || 'Usuário'}!</span>
          <p className={styles.desc}>Busque um agendamento!</p>
        </span>
      </div>
      <section className={styles.container}>
        <div className={styles.wrapperTop}>
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
          {/* <div className={styles.wrapper}> */}
            <AppInput
              id="name"
              label="Nome  do paciente"
              type="text"
              disabled
              value={patient?.name || ''}
            />
            <span className={styles.reset}>
              <button onClick={handleReset} title="Resetar busca">
                <RiResetRightLine />
              </button>
            </span>
          {/* </div> */}
        </div>
        <div className={styles.wrapperTable}>
          <table className={styles.tabelAppointments}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Especialidade</th>
                <th>Médico</th>
                <th>CRM</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(appointmentsPatient) &&
                appointmentsPatient.map((item, i) => (
                  <tr key={i} className={styles.linha}>
                    <td className={styles.date}>
                      <span> {format(item.date, 'dd/MM/yyyy HH:mm')}</span>
                    </td>
                    <td className={styles.specialty}>
                      {item.Specialties.name}
                    </td>
                    <td className={styles.doctor}>{item.Doctors.name}</td>
                    <td className={styles.crm}>
                      <span className={styles.crmNumber}>
                        {item.Doctors.crm}
                      </span>
                      <span className={styles.actions}>
                        <button
                          className={styles.edit}
                          title="Editar"
                          onClick={() => {
                            setOpenModalEdit(true)
                            setAppointmentToUpdate(item.i)
                          }}
                        >
                          <MdOutlineEdit />
                        </button>

                        <button
                          className={styles.delete}
                          title="Excluir"
                          onClick={() => {
                            setOpenModalDelete(true)
                            setAppointmentToDelete(item.id)
                          }}
                        >
                          <RiDeleteBin6Line />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
      <ModalEditAppointment
        isOpen={isOpenModalEdit}
        onClose={() => setOpenModalEdit(false)}
        appointmentsData={
          Array.isArray(appointmentsPatient) &&
          appointmentsPatient?.find(
            (a: AppointmentsPatientResponse) => a.id === appointmentToUpdate
          )
        }
        onConfirm={handleUpdateAppointment}
      />
      <ModalDeleteAppointment
        isOpen={isOpenModalDelete}
        onClose={() => setOpenModalDelete(false)}
        onConfirm={handleDeleteAppointment}
      />
    </div>
  )
}
