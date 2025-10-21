//'use client'
import { FormEvent, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { User } from '@/domain/models/user'
import {
  CreateUserBody,
  CreateUserServiceContract
} from '@/data/user-service/create-user-service/create-user-service'
import { enqueueSnackbar } from 'notistack'
import { AxiosError } from 'axios'
import {
  AuthResponse,
  AuthUserBody,
  AuthUserServiceContract
} from '@/data/user-service/auth-user/auth-user-service'
import { useRouter } from 'next/navigation'

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

  const { mutate: createUser, isPending } = useMutation<
    User,
    AxiosError<ApiError>,
    CreateUserBody
  >({
    mutationFn: (data: CreateUserBody) => {
      return createUserService.exec(data)
    },
    onError: (err) => {
      const message = err.response?.data?.message || 'Erro ao criar usuário.'
      enqueueSnackbar(message, { variant: 'error' })
    },
    onSuccess: () => {
      enqueueSnackbar('Usuário criado com sucesso!', { variant: 'success' })
    }
  })

  const {
    mutate: authUser
    //isPending
  } = useMutation<AuthResponse, AxiosError<ApiError>, AuthUserBody>({
    mutationFn: (data: AuthUserBody) => {
      return authUserService.exec(data)
    },
    onError: (err) => {
      const message = err.response?.data?.message || 'Erro ao criar usuário.'
      enqueueSnackbar(message, { variant: 'error' })
    },
    onSuccess: (data) => {
      enqueueSnackbar('Login feito com sucesso!', { variant: 'success' })

      if (data.token) {
        router.push('/appointments')
      } else {
        enqueueSnackbar('Error', { variant: 'error' })
      }
    }
  })

  const handleForms = () => {
    if (!signUpForm) {
      setSignUpForm(true)
      setShowLoginForm(false)
    }
    if (!showLoginForm) {
      setShowLoginForm(true)
      setSignUpForm(false)
    }
  }
  const handleCreateUser = (e: FormEvent) => {
    e.preventDefault()
    createUser({
      name: createUserPayload.name,
      email: createUserPayload.email,
      password: createUserPayload.password
    })
    setCreateUserPayload({ name: '', email: '', password: '' })
    setSignUpForm(false)
    setShowLoginForm(true)
  }
  const handleCreateLogin = (e: FormEvent) => {
    e.preventDefault()

    authUser({
      email: createLoginPayload.email,
      password: createLoginPayload.password
    })
    setCreateLoginPayload({ email: '', password: '' })
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
    isPending
  }
}
