'use client'
import styles from './page.module.scss'
import BackgroundImage from '@/presentation/components/BackgroundImage'
import { ForgotPasswordForm } from './components/ForgotPasswordForm'
import Form from 'next/form'
import Image from 'next/image'
import Link from 'next/link'
import { enumsRoutes } from '@/shared/enums/enumsRoutes'

export default function forgotPage() {
  return (
    <div className={styles.page}>
      <BackgroundImage src="/bg-register.png" />
      <div className={styles.formWrapper}>
        <div className={styles.container}>
          <div className={styles.pageTitle}>
            <span>
              <h1>Recuperar</h1>
            </span>
            <Image alt="" src="/logo-bg-blue.png" width={100} height={100} />
          </div>
          <h2 className={styles.title}> Solicite redefinição!</h2>
          <div className={styles.descripiton}>
            <p>
              Informe um email e enviaremos um link para recuperação da sua
              senha.
            </p>
          </div>
          <div className={styles.formArea}>
            <Form action="/search">
              <ForgotPasswordForm />
            </Form>
          </div>
          <p className={styles.links}>
            <span>
              Deseja cancelar?{' '}
              <Link href={enumsRoutes.AUTHENTICATION}>
                Voltar à Página Inicial
              </Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
