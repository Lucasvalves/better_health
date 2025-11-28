'use client'
import { CreateScheduleServiceContract } from './../../../data/schedule-service/create-times-service/create-schedule-service'
import { FormEvent, useState } from 'react'
import Cookies from 'js-cookie'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GetDoctorByCRMResponse } from '@/domain/models/doctor'
import { CreateScheduleBody } from '@/data/schedule-service/create-times-service/create-schedule-service'
import { AxiosError } from 'axios'
import { enqueueSnackbar } from 'notistack'
import { Schedule } from '@/domain/models/schedule'
import { scheduleSchema } from '@/domain/validations/schedule-validation'
import { ZodError } from 'zod'
import { GetDoctorByCRMServiceContract } from '@/data/doctor-service/get-doctor/get-doctor-by-crm/get-doctor-by-crm-service'

export interface ScheduleServiceRegistry {
  getDoctorByCRMService: GetDoctorByCRMServiceContract
  createScheduleService: CreateScheduleServiceContract
}

type ApiError = {
  message?: string
}

export const useScheduleModel = (props: ScheduleServiceRegistry) => {
  const { getDoctorByCRMService, createScheduleService } = props

  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [crm, setCRM] = useState('')
  const [crmFinal, setCRMFinal] = useState('')
  const [startHour, setStartHour] = useState('')
  const [endHour, setEndHour] = useState('')

  const token = Cookies.get('token')
  const queryClient = useQueryClient()

  const { data: doctor } = useQuery<GetDoctorByCRMResponse>({
    queryKey: ['doctor', crmFinal],
    queryFn: async () => {
      if (!token) throw new Error('Token not found')

      try {
        return await getDoctorByCRMService.exec({ crm: crmFinal, token })
      } catch (error: unknown) {
        enqueueSnackbar('Erro ao buscar Médico.', { variant: 'error' })
        queryClient.setQueryData(['doctor', crmFinal], null)
        throw error
      }
    },
    enabled: !!token && crmFinal.length >= 1,
    retry: false
  })

  const { mutate: createSchedule } = useMutation<
    Schedule,
    AxiosError<ApiError>,
    { body: CreateScheduleBody; token?: string }
  >({
    mutationFn: ({ body, token }) =>
      createScheduleService.exec({ body, token }),

    onSuccess: () => {
      enqueueSnackbar('Horário criado com sucesso!', {
        variant: 'success'
      })
    },

    onError: (err) => {
      enqueueSnackbar(err.response?.data?.message || 'Erro ao criar horário.', {
        variant: 'error'
      })
    }
  })

  const handdlCreateSchedule = (e: FormEvent) => {
    e.preventDefault()

    try {
      scheduleSchema.parse({
        crm: crmFinal,
        startHour,
        endHour,
        selectedDate
      })
    } catch (error) {
      if (error instanceof ZodError) {
        enqueueSnackbar(error.issues[0].message, { variant: 'error' })
        return
      }
    }

    if (!doctor?.id || !doctor?.specialties_id) {
      enqueueSnackbar('Dados do médico não encontrados.', { variant: 'error' })
      return
    }

    createSchedule({
      body: {
        startHour,
        endHour,
        days: selectedDate!.getDay(),
        doctors_id: doctor.id,
        specialties_id: doctor.specialties_id
      },
      token
    })
    queryClient.removeQueries({ queryKey: ['doctor'] })
  }

  const handleReset = () => {
    setCRMFinal('')
    setCRM('')
    setStartHour('')
    setEndHour('')
    setSelectedDate(undefined)
  }

  return {
    handleReset,
    setSelectedDate,
    handdlCreateSchedule,
    setCRM,
    setStartHour,
    setEndHour,
    selectedDate,
    doctor,
    crm,
    startHour,
    endHour,
    setCRMFinal
  }
}
