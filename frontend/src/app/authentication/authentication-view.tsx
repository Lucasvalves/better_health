'use client'

import styles from './page.module.scss'
import { Condition } from '@/presentation/components/Condition'
import SignUpForm from './components/sign-up-form'
import LoginForm from './components/login-form'
import { useAuthenticationModel } from './authentication-model'
import Image from 'next/image'
import Link from 'next/link'

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
    isPendingCreateUser,
    isPendingLoginUser,
    handleCreateLogin,
    setCreateLoginPayload,
    createLoginPayload,
    fieldErrors,
    touched,
    setTouched,
    touchedLogin,
    setTouchedLogin,
    fieldErrorsLogin
  } = methods

  return (
    <div className={styles.page}>
      <div className={styles.backgroundImage}>
        <Image
          src="/bg-login.png"
          alt=""
          priority
          fill
          className={styles.bgImage}
        />
        <Link href="/">
          <div className={styles.logo} />
        </Link>
      </div>
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
          <h2 className={styles.title}>
            {showLoginForm
              ? 'Bem-vindo de volta!'
              : 'Crie sua conta para começar.'}
          </h2>
          <div className={styles.formArea}>
            <Condition when={showLoginForm}>
              <LoginForm
                handleCreateLogin={handleCreateLogin}
                setEmail={(email: string) =>
                  setCreateLoginPayload((prev) => ({ ...prev, email }))
                }
                setPassword={(password: string) =>
                  setCreateLoginPayload((prev) => ({ ...prev, password }))
                }
                email={createLoginPayload.email}
                password={createLoginPayload.password}
                isLoading={isPendingLoginUser}
                touched={touchedLogin}
                setTouched={setTouchedLogin}
                fieldErrors={fieldErrorsLogin}
                className={styles.loginForm}
              />
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
                name={createUserPayload.name ?? ''}
                email={createUserPayload.email ?? ''}
                password={createUserPayload.password ?? ''}
                handleCreateUser={handleCreateUser}
                isLoading={isPendingCreateUser}
                touched={touched}
                setTouched={setTouched}
                fieldErrors={fieldErrors}
              />
            </Condition>
          </div>
        </div>
      </div>
    </div>
  )
}
