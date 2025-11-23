'use client'
import { Patient } from '../../../domain/models/patient'
import { FormEvent, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { enqueueSnackbar } from 'notistack'
import { AxiosError } from 'axios'
import Cookies from 'js-cookie'

import {
  CreatePatientBody,
  CreatePatientServiceContract
} from '@/data/patient-service/create-patient/create-patient-service'
import { PatientSchema } from '@/domain/validations/patient-validation'

export type PatientServiceRegistry = {
  createPatientService: CreatePatientServiceContract
}

type ApiError = {
  message?: string
}

export const useRegisterPatientModel = (props: PatientServiceRegistry) => {
  const { createPatientService } = props

  const [createPatientPayload, setCreatePatientPayload] = useState<Patient>({
    name: '',
    cpf: '',
    phone: ''
  })

  const { mutate: createPatient } = useMutation<
    Patient,
    AxiosError<ApiError>,
    { body: CreatePatientBody; token?: string }
  >({
    mutationFn: ({ body, token }) => createPatientService.exec({ body, token }),
    onError: (err) => {
      const message = err.response?.data?.message || 'Erro ao criar Paciente.'
      enqueueSnackbar(message, { variant: 'error' })
    },
    onSuccess: () => {
      enqueueSnackbar('Paciente criado com sucesso!', { variant: 'success' })
    }
  })

  const handleCreatePatient = (e: FormEvent) => {
    e.preventDefault()

    const validation = PatientSchema.safeParse(createPatientPayload)
    if (!validation.success) {
      enqueueSnackbar(validation.error.issues[0].message, {
        variant: 'warning'
      })
      return
    }

    const token = Cookies.get('token')
    createPatient({ body: createPatientPayload, token })

    setCreatePatientPayload({ name: '', cpf: '', phone: '' })
  }

  const handleReset = () => {
    setCreatePatientPayload({
      name: '',
      cpf: '',
      phone: ''
    })
  }

  return {
    handleCreatePatient,
    handleReset,
    setCreatePatientPayload,
    createPatientPayload
  }
}
