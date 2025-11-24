'use client'
import { Specialty } from './../../../domain/models/specialty'
import { Doctor } from '../../../domain/models/doctor'
import { FormEvent, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { enqueueSnackbar } from 'notistack'
import { AxiosError } from 'axios'
import Cookies from 'js-cookie'

import { DoctorSchema } from '@/domain/validations/doctor-validation'
import {
  CreateDoctorBody,
  CreateDoctorServiceContract
} from '@/data/doctor-service/create-doctor/create-doctor-service'
import { GetSpecialtiesServiceContract } from '@/data/specialty-service/get-specialties-service/get-specialties-service'

export type DoctorServiceRegistry = {
  createDoctorService: CreateDoctorServiceContract
  getSpecialtiesService: GetSpecialtiesServiceContract
}

type ApiError = {
  message?: string
}

export const useRegisterDoctorModel = (props: DoctorServiceRegistry) => {
  const { createDoctorService, getSpecialtiesService } = props

  const token = Cookies.get('token')

  const [createDoctorPayload, setCreateDoctorPayload] = useState<Doctor>({
    name: '',
    crm: '',
    specialties_id: ''
  })

  const queryClient = useQueryClient()

  const { data: specialties } = useQuery<Specialty[]>({
    queryKey: ['specialties'],
    queryFn: () => {
      if (!token) throw new Error('Token not found')
      return getSpecialtiesService.exec({ token })
    },
    enabled: !!token
  })

  const { mutate: createDoctor } = useMutation<
    Doctor,
    AxiosError<ApiError>,
    { body: CreateDoctorBody; token?: string }
  >({
    mutationFn: ({ body, token }) => createDoctorService.exec({ body, token }),
    onSuccess: () => {
      enqueueSnackbar('Doutor criado com sucesso!', { variant: 'success' })

      queryClient.invalidateQueries({ queryKey: ['specialties'] })
    },
    onError: (err) => {
      const message = err.response?.data?.message || 'Erro ao criar Doutor.'
      enqueueSnackbar(message, { variant: 'error' })
    }
  })

  const handleCreateDoctor = (e: FormEvent) => {
    e.preventDefault()

    const validation = DoctorSchema.safeParse(createDoctorPayload)
    if (!validation.success) {
      enqueueSnackbar(validation.error.issues[0].message, {
        variant: 'warning'
      })
      return
    }

    createDoctor({ body: createDoctorPayload, token })
    setCreateDoctorPayload({ name: '', crm: '', specialties_id: '' })
  }

  const handleReset = () => {
    setCreateDoctorPayload({
      name: '',
      crm: '',
      specialties_id: ''
    })
  }

  return {
    handleCreateDoctor,
    handleReset,
    setCreateDoctorPayload,
    createDoctorPayload,
    specialties,
  }
}
