'use client'

import { enumsRoutes } from '@/shared/enums/enumsRoutes'
import styles from './page.module.scss'
import { useNavModel } from './nav-model'
import Link from 'next/link'
import { CgProfile } from 'react-icons/cg'
import { useEffect, useRef, useState } from 'react'
import { FiLogOut } from 'react-icons/fi'

export const Nav = () => {
  const { logout } = useNavModel()
  const [open, setOpen] = useState(false)

  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={styles.container}>
      <Link href={enumsRoutes.APPOINTMENTS}>Realizar Agendamento</Link>
      <Link href={enumsRoutes.SEARCH_APPOINTMENTS}>Buscar Agendamentos</Link>
      <Link href={enumsRoutes.SCHEDULE}>Montar Agenda</Link>
      <div className={styles.profile} ref={profileRef}>
        <div className={styles.dropdown} onClick={() => setOpen(!open)}>
          <span>
            <CgProfile size={18} />
            Perfil
          </span>

          <ul className={`${styles.dropdownMenu} ${open && styles.open}`}>
            <Link href={enumsRoutes.REGISTER_DOCTOR}>
              <li className={styles.dropdownMenuItem}>Cadastrar Médico</li>
            </Link>
            <Link href={enumsRoutes.REGISTER_PATIENT}>
              <li className={styles.dropdownMenuItem}>Cadastrar Paciente</li>
            </Link>
            <Link href={enumsRoutes.REGISTER_SPECIALTY}>
              <li className={styles.dropdownMenuItem}>
                Cadastrar Especialidade
              </li>
            </Link>
            <Link href={enumsRoutes.PROFILE}>
              <li className={styles.dropdownMenuItem}>Editar Perfil</li>
            </Link>
            <Link href={enumsRoutes.AUTHENTICATION} onClick={logout}>
              <li className={styles.logout}>
                <FiLogOut className={styles.icon} />
                Sair
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  )
}
