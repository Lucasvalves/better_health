'use client'

import BackgroundImage from '@/presentation/components/BackgroundImage'
import styles from './page.module.scss'
import Form from 'next/form'
import { Condition } from '@/presentation/components/Condition'
import SignUpForm from './components/sign-up-form'
import LoginForm from './components/login-form'
import { enumsRoutes } from '@/shared/enums/enumsRoutes'
import Link from 'next/link'
import { useAuthenticationModel } from './authentication-model'

export const AuthenticationView = (
  methods: ReturnType<typeof useAuthenticationModel>
) => {
  const {
    showLoginForm,
    signUpForm,
    handleForms,
    handleCreateUser,
    setCreateUserPayload,
    createUserPayload,
    isPending
  } = methods

  return (
    <div className={styles.page}>
      <BackgroundImage src="/bg-login.png" />
      <div className={styles.formWrapper}>
        <div className={styles.container}>
          <div className={styles.formOptions}>
            <button
              onClick={handleForms}
              className={showLoginForm === true ? '' : styles.seletedButton}
            >
              Login
            </button>
            <button
              onClick={handleForms}
              className={signUpForm === true ? '' : styles.seletedButton}
            >
              Criar conta
            </button>
          </div>
          <h2 className={styles.title}>Olá! Seja Bem Vindo!</h2>
          <div className={styles.formArea}>
            <Form action="/search" onSubmit={handleCreateUser}>
              <Condition when={showLoginForm}>
                <LoginForm />
              </Condition>
              <Condition when={signUpForm}>
                <SignUpForm
                  setName={(name: string) =>
                    setCreateUserPayload((prev) => ({ ...prev, name }))
                  }
                  setEmail={(email: string) =>
                    setCreateUserPayload((prev) => ({ ...prev, email }))
                  }
                  setPassword={(password: string) =>
                    setCreateUserPayload((prev) => ({ ...prev, password }))
                  }
                  name={createUserPayload.name}
                  email={createUserPayload.email}
                  password={createUserPayload.password}
                  isLoading={isPending}
                />
              </Condition>
            </Form>
          </div>
          <p className={styles.links}>
            <span>
              Esqueceu sua senha?{' '}
              <Link href={enumsRoutes.FORGOT}>Recuperar</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
