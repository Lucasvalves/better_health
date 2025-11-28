'use client'
import { HttpClient } from '@/infrastructure/http/http-client'
import { GetPatientByCPFService } from '@/data/patient-service/get-patient/get-patient-by-cpf-service'
import { useSearchAppointmentsModel } from './search-appoiments-model'
import SearchAppointmentsView from './search-appoiments-view'

export const SearchAppointmentsViewModel = () => {
  const httpClient = HttpClient.create()
  const getPatientByCPFService = GetPatientByCPFService.create(httpClient)

  const methods = useSearchAppointmentsModel({
    getPatientByCPFService
  })

  return <SearchAppointmentsView {...methods} />
}
