import Image from 'next/image'
import styles from './page.module.scss'
import Link from 'next/link'

type Props = {
  src: string
}
export const BackgroundImage = ({ src }: Props) => {
  return (
    <div className={styles.background}>
      <Image src={src} alt="" fill className={styles.bgImage} />
      <Link href="/">
        <div className={styles.logo} />
      </Link>
    </div>
  )
}

export default BackgroundImage
