'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie'
import { enqueueSnackbar } from 'notistack'
import { format } from 'date-fns'
import { AxiosError } from 'axios'

import { Specialty } from '@/domain/models/specialty'
import { Patient } from '@/domain/models/patient'
import { Appointment } from '@/domain/models/appointment'
import { GetDoctorByCRMResponse } from '@/domain/models/doctor'

import { GetSpecialtiesServiceContract } from '@/data/specialty-service/get-specialties-service/get-specialties-service'
import { GetAvailableDaysServiceContract } from '@/data/appointments-service/get-specialties-service/get-available-days-service'
import { GetPatientByCPFServiceContract } from '@/data/patient-service/get-patient/get-doctor-by-cpf-service'
import { CreateAppointmentServiceContract } from '@/data/appointments-service/create-appointment/create-appointment-service'
import { getDoctorByIDServiceServiceContract } from '@/data/doctor-service/get-doctor/get-doctor-by-id/get-doctor-by-id-service'

export type AppointmentsServiceRegistry = {
  getPatientByCPFService: GetPatientByCPFServiceContract
  getSpecialtiesService: GetSpecialtiesServiceContract
  getAvailableDaysService: GetAvailableDaysServiceContract
  createAppointmentService: CreateAppointmentServiceContract
  getDoctorByCRMService: getDoctorByIDServiceServiceContract
}

type ApiError = {
  message?: string
}

export const useAppointmentsModel = (props: AppointmentsServiceRegistry) => {
  const {
    getPatientByCPFService,
    getSpecialtiesService,
    getAvailableDaysService,
    createAppointmentService,
    getDoctorByCRMService
  } = props

  const token = Cookies.get('token')
  const queryClient = useQueryClient()

  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [cpf, setCPF] = useState('')
  const [cpfFinal, setCPFFinal] = useState('')
  const [specialtyId, setSpecialtyId] = useState<string>('')

  const { data: patient } = useQuery<Patient>({
    queryKey: ['patient', cpfFinal],
    enabled: !!token && !!cpfFinal,
    retry: false,
    queryFn: async () => {
      try {
        return await getPatientByCPFService.exec({
          cpf: cpfFinal,
          token: token!
        })
      } catch (error) {
        enqueueSnackbar('Erro ao buscar Paciente.', { variant: 'error' })
        queryClient.setQueryData(['patient', cpfFinal], null)
        throw error
      }
    }
  })

  const { data: specialties } = useQuery<Specialty[]>({
    queryKey: ['specialties'],
    enabled: !!token,
    queryFn: () => getSpecialtiesService.exec({ token: token! })
  })

  const { data: availableDays } = useQuery({
    queryKey: ['availableDays', specialtyId],
    enabled: !!token && !!specialtyId,
    queryFn: () =>
      getAvailableDaysService.exec({
        token: token!,
        body: {
          specialties_id: specialtyId,
          date: new Date()
        }
      })
  })

  useEffect(() => {
    if (specialtyId && availableDays && !availableDays.doctrs?.length) {
      enqueueSnackbar('Não existem dias disponíveis.', { variant: 'error' })
    }
  }, [specialtyId, availableDays])

  const normalizedAvailableDays = useMemo(() => {
    if (!availableDays?.schedule) return []
    return availableDays.schedule.map((item) => {
      const key = Object.keys(item)[0]
      const [day, month, year] = key.split('-').map(Number)
      return new Date(year, month - 1, day)
    })
  }, [availableDays])

  const availableTimes = useMemo(() => {
    if (!availableDays || !selectedDate) return []

    const key = format(selectedDate, 'dd-MM-yyyy')
    const dayObj = availableDays.schedule.find(
      (obj) => Object.keys(obj)[0] === key
    )
    if (!dayObj) return []

    const doctorId = availableDays.doctrs[0]
    const times = dayObj[key][doctorId]
    return times.flat()
  }, [availableDays, selectedDate])

  const { data: doctor } = useQuery<GetDoctorByCRMResponse>({
    queryKey: ['doctor', availableDays?.doctrs?.[0]],
    enabled: !!token && !!availableDays?.doctrs?.[0],
    retry: false,
    queryFn: () =>
      getDoctorByCRMService.exec({
        id: availableDays!.doctrs[0],
        token: token!
      })
  })

  const { mutate: CreateAppointment } = useMutation<
    Appointment,
    AxiosError<ApiError>,
    { body: Appointment; token?: string }
  >({
    mutationFn: ({ body, token }) =>
      createAppointmentService.exec({ body, token }),

    onSuccess: () => {
      enqueueSnackbar('Consulta criada com sucesso!', { variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },

    onError: (err) => {
      const msg = err.response?.data?.message || 'Erro ao criar Médico.'
      enqueueSnackbar(msg, { variant: 'error' })
    }
  })

  const handleCreateAppointment = (e: FormEvent) => {
    e.preventDefault()

    if (!availableDays?.doctrs) {
      enqueueSnackbar('Dados do médico não encontrados.', { variant: 'error' })
      return
    }

    if (!patient?.id) {
      enqueueSnackbar('Dados do paciente não encontrados.', {
        variant: 'error'
      })
      return
    }

    if (!selectedDate || !selectedTime) {
      enqueueSnackbar('Selecione uma data e horário.', { variant: 'warning' })
      return
    }

    const doctorId = availableDays.doctrs[0]
    const [h, m] = selectedTime.split(':').map(Number)

    const finalDate = new Date(selectedDate)
    finalDate.setHours(h, m, 0, 0)

    const body: Appointment = {
      date: finalDate,
      doctors_id: doctorId,
      patients_id: patient.id,
      specialties_id: specialtyId
    }

    CreateAppointment({ body, token })
  }

  const handleReset = () => {
    setSpecialtyId('')
    setCPF('')
    setCPFFinal('')

    queryClient.removeQueries({
      queryKey: ['patient'],
      exact: false
    })
  }
  return {
    selectedDate,
    selectedTime,
    specialtyId,
    cpf,
    cpfFinal,
    setSelectedDate,
    setSelectedTime,
    setSpecialtyId,
    setCPF,
    setCPFFinal,
    handleReset,
    patient,
    specialties,
    normalizedAvailableDays,
    availableTimes,
    doctor,
    handleCreateAppointment
  }
}
