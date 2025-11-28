'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import Cookies from 'js-cookie'
import { enqueueSnackbar } from 'notistack'
// import { format } from 'date-fns'
// import { AxiosError } from 'axios'

import { Patient } from '@/domain/models/patient'

import { GetPatientByCPFServiceContract } from '@/data/patient-service/get-patient/get-patient-by-cpf-service'

export type SearchAppointmentsServiceRegistry = {
  getPatientByCPFService: GetPatientByCPFServiceContract
}

// type ApiError = {
//   message?: string
// }

export const useSearchAppointmentsModel = (
  props: SearchAppointmentsServiceRegistry
) => {
  const { getPatientByCPFService } = props

  const token = Cookies.get('token')
  const queryClient = useQueryClient()

  const [selectedDate, setSelectedDate] = useState<string>()
  const [cpf, setCPF] = useState('')
  const [cpfFinal, setCPFFinal] = useState('')

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
  const handleReset = () => {
    setCPF('')
    setCPFFinal('')

    queryClient.removeQueries({
      queryKey: ['patient'],
      exact: false
    })
  }
  return {
    selectedDate,
    cpf,
    cpfFinal,
    setCPF,
    setCPFFinal,
    handleReset,
    patient,
    setSelectedDate
  }
}
