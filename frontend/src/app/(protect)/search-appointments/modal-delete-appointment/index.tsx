'use client'
import styles from './styles.module.scss'

interface ModalDeleteAppointmentProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ModalDeleteAppointment({
  isOpen,
  onClose,
  onConfirm
}: ModalDeleteAppointmentProps) {

  const handleOutsideClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === 'modal') onClose()
  }


  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={handleOutsideClick} id="modal">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h2>Excluir Agendamento</h2>

        <p>Tem certeza que deseja excluir o agendamento?</p>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose}>
            Cancelar
          </button>

          <button className={styles.delete} onClick={onConfirm}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}
