'use client'
import { useState } from 'react'
import { MdClose } from 'react-icons/md'
import { IoIosCalendar } from 'react-icons/io'
import { WiTime9 } from 'react-icons/wi'
import styles from './styles.module.scss'
import { ButtonGroup } from '../../../../presentation/components/ButtonGroup'
import { AppointmentsPatientResponse } from '@/domain/models/appointment'
import { format } from 'date-fns'

interface Props {
  isOpen: boolean
  onClose: () => void
  appointmentsData: AppointmentsPatientResponse | undefined
  onConfirm: (newDate: string) => void
}

export const ModalEditAppointment = ({
  isOpen,
  onClose,
  appointmentsData,
  onConfirm
}: Props) => {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const handleOutsideClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === 'modal') onClose()
  }

  if (!isOpen) return null

  return (
    <div id="modal" className={styles.container} onClick={handleOutsideClick}>
      <div className={styles.modal}>
        <span className={styles.title}>
          <strong>Editar Horário</strong>
          <button title="Fechar" onClick={onClose}>
            <MdClose size={20} />
          </button>
        </span>
        {appointmentsData && format(appointmentsData.date, 'dd/MM/yyyy HH:mm')}
        <p>
          <span>{appointmentsData?.Patients?.name}</span>
        </p>
        <form action="">
          <div className={styles.inputContainer}>
            <label>Nova data:</label>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>
                <span className={styles.icon}>
                  <IoIosCalendar />
                </span>
                <input
                  title="Data'"
                  type="date"
                  className={styles.input}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className={styles.inputContainer}>
            <label>Novo horário:</label>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>
                <span className={styles.icon}>
                  <WiTime9 />
                </span>
                <input
                  title="Hora'"
                  type="time"
                  className={styles.input}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </label>
            </div>
          </div>

          <span className={styles.buttons}>
            <ButtonGroup
              rightButtonClick={onClose}
              rightButtonLabel="Cancelar"
              leftButtonLabel="Editar"
              leftButtonClick={() => {
                const newDate = `${date} ${time}`
                onConfirm(newDate)
              }}
            />
          </span>
        </form>
      </div>
    </div>
  )
}
