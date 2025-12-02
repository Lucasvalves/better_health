'use client'

import Link from 'next/link'
import styles from './page.module.scss'
import { MdMenu } from 'react-icons/md'
import { Nav } from './Nav'
import { enumsRoutes } from '@/shared/enums/enumsRoutes'
import { useHeaderModel } from './header-model'
import { MenuMobile } from './MenuMobile'

export default function Header() {
  const { setMenuMobileIsVisible, menuMobileIsVisible } = useHeaderModel()

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
            <MdMenu
              size={35}
              className={styles.mobile}
              onClick={() => setMenuMobileIsVisible(true)}
            />
          </div>
        </div>
      </section>
      <MenuMobile
        menuMobileIsVisible={menuMobileIsVisible}
        setMenuMobileIsVisible={setMenuMobileIsVisible}
      />
    </div>
  )
}
