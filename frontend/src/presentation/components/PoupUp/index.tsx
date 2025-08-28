import { MdClose } from 'react-icons/md'
import { IoIosCalendar } from 'react-icons/io'
import { WiTime9 } from 'react-icons/wi'
import styles from './page.module.scss'
import { ButtonGroup } from '../ButtonGroup'

export const PoupUp = () => (
  <div className={styles.container}>
    <span className={styles.title}>
      <strong>Editar Horário</strong>{' '}
      <button title="Fechar">
        <MdClose size={20} />
      </button>
    </span>
    <p>
      14h <span>Luana Prado</span>
    </p>
    <form action="">
      <span className={styles.inputContainer}>
        <label htmlFor="">Indique a nova data:</label>
        <div className={styles.inputWrapper}>
          <label className={styles.label}>
            <span className={styles.icon}>
              <IoIosCalendar />
            </span>
            <input title="Data" type="date" className={styles.input} />
          </label>
        </div>
      </span>
      <span className={styles.inputContainer}>
        <label htmlFor="">Indique o novo horário:</label>
        <div className={styles.inputWrapper}>
          <label className={styles.label}>
            <span className={styles.icon}>
              <WiTime9 />
            </span>
            <input title="Hora" type="time" className={styles.input} />
          </label>
        </div>
      </span>
      <span className={styles.buttons}>
        <ButtonGroup rightButtonLabel="Cancelar" leftButtonLabel="Editar" />
      </span>
    </form>
  </div>
)
