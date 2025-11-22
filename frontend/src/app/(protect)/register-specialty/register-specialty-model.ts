'use client'
import { Specialty } from './../../../domain/models/specialty'
import { FormEvent, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { enqueueSnackbar } from 'notistack'
import { AxiosError } from 'axios'
import Cookies from 'js-cookie'

import {
  CreateSpecialtyBody,
  CreateSpecialtyServiceContract
} from '@/data/specialty-service/create-specialty/create-specialty-service'

export type UserServiceRegistry = {
  createSpecialtyService: CreateSpecialtyServiceContract
}

type ApiError = {
  message?: string
}

import { z } from 'zod'

const specialtySchema = z.object({
  name: z.string().min(1, 'O nome da especialidade é obrigatório.')
})

export const useRegisterSpecialtyModel = (props: UserServiceRegistry) => {
  const { createSpecialtyService } = props

  const [specialtyName, setSpecialtyName] = useState('')

  const { mutate: createSpecialty } = useMutation<
    Specialty,
    AxiosError<ApiError>,
    { body: CreateSpecialtyBody; token?: string }
  >({
    mutationFn: ({ body, token }) =>
      createSpecialtyService.exec({ body, token }),
    onError: (err) => {
      const message =
        err.response?.data?.message || 'Erro ao criar Especialidade.'
      enqueueSnackbar(message, { variant: 'error' })
    },
    onSuccess: () => {
      enqueueSnackbar('Especialidade criado com sucesso!', {
        variant: 'success'
      })
    }
  })

  const handleCreateSpecialty = (e: FormEvent) => {
    e.preventDefault()

    const validation = specialtySchema.safeParse({ name: specialtyName })

    if (!validation.success) {
      const message = validation.error.issues[0].message
      enqueueSnackbar(message, { variant: 'warning' })
      return
    }

    const token = Cookies.get('token')
    const body: CreateSpecialtyBody = validation.data

    createSpecialty({ body, token })
    setSpecialtyName('')
  }

  const handleReset = () => {
    setSpecialtyName('')
  }

  return {
    handleCreateSpecialty,
    handleReset,
    setSpecialtyName,
    specialtyName
  }
}
