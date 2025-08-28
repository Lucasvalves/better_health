import Link from 'next/link'
import styles from './page.module.scss'
import { RiMenu3Fill } from 'react-icons/ri'
import { Nav } from '../Nav'
import { enumsRoutes } from '@/shared/enums/enumsRoutes'

export default function Header() {
  return (
    <div className={styles.container}>
      <section className={styles.wrapper}>
        <div>
          <div className={styles.containerMenu}>
            <Link href={enumsRoutes.APPOINTMENTS}>
              <div className={styles.logo} />
            </Link>
            <Nav />
          </div>
          <div className={styles.containerMenuMobile}>
            <RiMenu3Fill
              size={35}
              // onClick={() => setMenuIsVisible(true)}
              className={styles.containerMenuMobile}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
