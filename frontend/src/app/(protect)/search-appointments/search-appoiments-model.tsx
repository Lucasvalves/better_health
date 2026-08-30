'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { enqueueSnackbar } from 'notistack'

import { Patient } from '@/domain/models/patient'

import { GetPatientByCPFServiceContract } from '@/data/patient-service/get-patient/get-patient-by-cpf-service'
import {
  Appointment,
  AppointmentsPatientResponse
} from '@/domain/models/appointment'
import { GetAppointmentsPatientServiceContract } from '@/data/appointments-service/get-appointments-patient/get-appointments-patient'
import {
  DeleteAppointment,
  DeleteAppointmentServiceContract
} from '@/data/appointments-service/delete-appointment/delete-appointment-service'
import { AxiosError } from 'axios'
import {
  UpdateAppointment,
  UpdateAppointmentServiceContract
} from '@/data/appointments-service/update-appointment/update-appointment-service'

export type SearchAppointmentsServiceRegistry = {
  getPatientByCPFService: GetPatientByCPFServiceContract
  getAppointmentsPatientService: GetAppointmentsPatientServiceContract
  deleteAppointmentService: DeleteAppointmentServiceContract
  updateAppointmentService: UpdateAppointmentServiceContract
}
type ApiError = {
  message?: string
}

export const useSearchAppointmentsModel = (
  props: SearchAppointmentsServiceRegistry
) => {
  const {
    getPatientByCPFService,
    getAppointmentsPatientService,
    deleteAppointmentService,
    updateAppointmentService
  } = props

  const token = Cookies.get('token')
  const queryClient = useQueryClient()

  const [cpf, setCPF] = useState('')
  const [cpfFinal, setCPFFinal] = useState('')

  const [isOpenModalEdit, setOpenModalEdit] = useState(false)
  const [isOpenModalDelete, setOpenModalDelete] = useState(false)
  const [appointmentToDelete, setAppointmentToDelete] = useState('')
  const [appointmentToUpdate, setAppointmentToUpdate] = useState('')

  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    const name = Cookies.get('userName')?.split(' ').slice(0, 2).join(' ')
    if (name) setUserName(name)
  }, [])

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

  const { data: appointmentsPatient } = useQuery<AppointmentsPatientResponse>({
    queryKey: ['appointmentsPatient', patient?.id],
    enabled: !!token && !!patient?.id,
    retry: false,
    queryFn: async () => {
      try {
        if (!patient?.id) {
          throw new Error('Paciente não possui ID')
        }
        return await getAppointmentsPatientService.exec({
          patient_id: patient.id,
          token: token!
        })
      } catch (error) {
        enqueueSnackbar('Erro ao buscar Consultas do Paciente.', {
          variant: 'error'
        })
        queryClient.setQueryData(['appointmentsPatient', patient?.id], null)
        throw error
      }
    }
  })

  useEffect(() => {
    if (patient && !patient.id) {
      enqueueSnackbar('Dados do paciente não encontrados.', {
        variant: 'error'
      })
    }
  }, [patient])

  const { mutate: deleteAppointment } = useMutation<
    Appointment,
    AxiosError<ApiError>,
    DeleteAppointment
  >({
    mutationFn: ({ id, token }) => {
      if (!token) throw new Error('Token not found')

      return deleteAppointmentService.exec({ id, token })
    },

    onSuccess: () => {
      enqueueSnackbar('Consulta deletada com sucesso.', {
        variant: 'success'
      })
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Erro ao deletar consulta.'
      enqueueSnackbar(msg, { variant: 'error' })
      queryClient.invalidateQueries({ queryKey: ['appointmentsPatient'] })
    }
  })

  const { mutate: updateAppointment } = useMutation<
    Appointment,
    AxiosError<ApiError>,
    UpdateAppointment
  >({
    mutationFn: async ({ id, newDate, token }) => {
      if (!token) throw new Error('Token not found')

      return updateAppointmentService.exec({ id, newDate, token })
    },
    onSuccess: () => {
      enqueueSnackbar('Agendamento atualizado!', { variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['appointmentsPatient'] })
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Erro ao deletar consulta.'
      enqueueSnackbar(msg, { variant: 'error' })
      queryClient.invalidateQueries({ queryKey: ['appointmentsPatient'] })
    }
  })

  const handleReset = () => {
    setCPF('')
    setCPFFinal('')

    queryClient.removeQueries({
      queryKey: ['patient'],
      exact: false
    })
  }

  const handleDeleteAppointment = () => {
    if (!appointmentToDelete) return

    deleteAppointment({ id: appointmentToDelete, token })
    setOpenModalDelete(false)
  }

  const handleUpdateAppointment = (newDate: string) => {
    if (!appointmentToUpdate) return
    updateAppointment({
      id: appointmentToDelete,
      newDate,
      token
    })

    setOpenModalEdit(false)
  }

  return {
    setCPF,
    setCPFFinal,
    handleReset,
    cpf,
    cpfFinal,
    patient,
    appointmentsPatient,
    isOpenModalEdit,
    setOpenModalEdit,
    userName,
    isOpenModalDelete,
    setOpenModalDelete,
    handleDeleteAppointment,
    setAppointmentToDelete,
    handleUpdateAppointment,
    setAppointmentToUpdate,
    appointmentToUpdate
  }
}
