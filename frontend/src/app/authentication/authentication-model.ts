'use client'
import { FormEvent, useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { enqueueSnackbar } from 'notistack'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'

import { User } from '@/domain/models/user'
import {
  CreateUserBody,
  CreateUserServiceContract
} from '@/data/user-service/create-user-service/create-user-service'
import {
  AuthResponse,
  AuthUserBody,
  AuthUserServiceContract
} from '@/data/user-service/auth-user/auth-user-service'
import {
  loginSchema,
  signUpSchema,
  SignUpFormData,
  LoginFormData
} from '@/domain/validations/user-validation'

export type UserServiceRegistry = {
  createUserService: CreateUserServiceContract
  authUserService: AuthUserServiceContract
}

type ApiError = {
  message?: string
}

export const useAuthenticationModel = (props: UserServiceRegistry) => {
  const { createUserService, authUserService } = props
  const router = useRouter()

  const [showLoginForm, setShowLoginForm] = useState(true)
  const [signUpForm, setSignUpForm] = useState(false)

  const [createUserPayload, setCreateUserPayload] = useState<User>({
    name: '',
    email: '',
    password: ''
  })
  const [createLoginPayload, setCreateLoginPayload] = useState<User>({
    email: '',
    password: ''
  })

  const { mutate: createUser, isPending: isPendingCreateUser } = useMutation<
    User,
    AxiosError<ApiError>,
    CreateUserBody
  >({
    mutationFn: (data) => createUserService.exec(data),
    onError: (err) => {
      const message = err.response?.data?.message || 'Erro ao criar usuário.'
      enqueueSnackbar(message, { variant: 'error' })
    },
    onSuccess: () => {
      enqueueSnackbar('Usuário criado com sucesso!', { variant: 'success' })
      handleForms()
    }
  })

  const { mutate: authUser, isPending: isPendingLoginUser } = useMutation<
    AuthResponse,
    AxiosError<ApiError>,
    AuthUserBody
  >({
    mutationFn: (data) => authUserService.exec(data),
    onError: (err) => {
      const message =
        err.response?.data?.message || 'Erro ao autenticar usuário.'
      enqueueSnackbar(message, { variant: 'error' })
    },
    onSuccess: (data) => {
      enqueueSnackbar('Login feito com sucesso!', { variant: 'success' })
      if (data.token) {
        router.push('/appointments')
      }
    }
  })

  const handleForms = () => {
    setShowLoginForm(!showLoginForm)
    setSignUpForm(!signUpForm)
    setTouched({
      name: false,
      email: false,
      password: false
    })
    setTouchedLogin({
      email: false,
      password: false
    })
  }

  const [touched, setTouched] = useState<Record<keyof SignUpFormData, boolean>>(
    {
      name: false,
      email: false,
      password: false
    }
  )

  const parsedErrors = useMemo(() => {
    const result = signUpSchema.safeParse(createUserPayload)
    if (!result.success) return result.error.flatten().fieldErrors
    return {}
  }, [createUserPayload])

  const fieldErrors: Partial<Record<keyof SignUpFormData, string>> = {
    name: touched.name ? parsedErrors.name?.[0] : undefined,
    email: touched.email ? parsedErrors.email?.[0] : undefined,
    password: touched.password ? parsedErrors.password?.[0] : undefined
  }

  const handleCreateUser = (e: FormEvent) => {
    e.preventDefault()

    const validation = signUpSchema.safeParse(createUserPayload)
    if (!validation.success) {
      setTouched({
        name: true,
        email: true,
        password: true
      })
      enqueueSnackbar('Dados inválidos.', { variant: 'warning' })
      return
    }

    createUser(validation.data)
    setCreateUserPayload({ name: '', email: '', password: '' })
    setTouched({
      name: false,
      email: false,
      password: false
    })
  }

  const [touchedLogin, setTouchedLogin] = useState<
    Record<keyof LoginFormData, boolean>
  >({
    email: false,
    password: false
  })

  const parsedErrorsLogin = useMemo(() => {
    const result = loginSchema.safeParse(createLoginPayload)
    if (!result.success) return result.error.flatten().fieldErrors
    return {}
  }, [createLoginPayload])

  const fieldErrorsLogin: Partial<Record<keyof LoginFormData, string>> = {
    email: touchedLogin.email ? parsedErrorsLogin.email?.[0] : undefined,
    password: touchedLogin.password
      ? parsedErrorsLogin.password?.[0]
      : undefined
  }

  const handleCreateLogin = (e: FormEvent) => {
    e.preventDefault()

    const validation = loginSchema.safeParse(createLoginPayload)

    if (!validation.success) {
      const message = validation.error.issues[0]?.message || 'Dados inválidos.'
      enqueueSnackbar(message, { variant: 'warning' })
      return
    }

    authUser(validation.data)
    setCreateLoginPayload({ email: '', password: '' })
    setTouchedLogin({
      email: false,
      password: false
    })
  }

  return {
    showLoginForm,
    setShowLoginForm,
    signUpForm,
    setSignUpForm,
    handleForms,
    handleCreateUser,
    setCreateUserPayload,
    createUserPayload,
    handleCreateLogin,
    setCreateLoginPayload,
    createLoginPayload,
    isPendingCreateUser,
    isPendingLoginUser,
    fieldErrors,
    touched,
    setTouched,
    touchedLogin,
    setTouchedLogin,
    fieldErrorsLogin
  }
}
