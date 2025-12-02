'use client'

import Link from 'next/link'
import { FiLogOut } from 'react-icons/fi'
import styles from './styles.module.scss'
import { enumsRoutes } from '@/shared/enums/enumsRoutes'
import { useHeaderModel } from '../header-model'
import { IoClose } from 'react-icons/io5'

interface Props {
  menuMobileIsVisible: boolean
  setMenuMobileIsVisible: (value: boolean) => void
}

const MenuMobile = ({ menuMobileIsVisible, setMenuMobileIsVisible }: Props) => {
  const { logout } = useHeaderModel()

  return (
    <div
      className={`
        ${styles.container}
        ${menuMobileIsVisible ? styles.visible : ''}
      `}
    >
      <IoClose size={45} onClick={() => setMenuMobileIsVisible(false)} />
      <nav>
        <ul>
          <Link
            href={enumsRoutes.APPOINTMENTS}
            onClick={() => setMenuMobileIsVisible(false)}
          >
            Realizar Agendamento
          </Link>
          <Link
            href={enumsRoutes.SEARCH_APPOINTMENTS}
            onClick={() => setMenuMobileIsVisible(false)}
          >
            Buscar Agendamentos
          </Link>
          <Link
            href={enumsRoutes.SCHEDULE}
            onClick={() => setMenuMobileIsVisible(false)}
          >
            Montar Agenda
          </Link>
          <Link href={enumsRoutes.REGISTER_DOCTOR}onClick={() => setMenuMobileIsVisible(false)} >Cadastrar Médico</Link>
          <Link href={enumsRoutes.REGISTER_PATIENT}onClick={() => setMenuMobileIsVisible(false)} >Cadastrar Paciente</Link>
          <Link href={enumsRoutes.REGISTER_SPECIALTY}onClick={() => setMenuMobileIsVisible(false)} >
            Cadastrar Especialidade
          </Link>
          <Link href={enumsRoutes.PROFILE} onClick={() => setMenuMobileIsVisible(false)} >Editar Perfil</Link>

          <Link href={enumsRoutes.AUTHENTICATION} onClick={logout}>
            <FiLogOut />
            Sair
          </Link>
        </ul>
      </nav>
    </div>
  )
}

export { MenuMobile }
