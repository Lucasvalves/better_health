'use client'
import { HttpClient } from '@/infrastructure/http/http-client'
import { GetPatientByCPFService } from '@/data/patient-service/get-patient/get-patient-by-cpf-service'
import { useSearchAppointmentsModel } from './search-appoiments-model'
import SearchAppointmentsView from './search-appoiments-view'
import { GetAppointmentsPatientService } from '@/data/appointments-service/get-appointments-patient/get-appointments-patient'
import { DeleteAppointmentService } from '@/data/appointments-service/delete-appointment/delete-appointment-service'
import { UpdateAppointmentService } from '@/data/appointments-service/update-appointment/update-appointment-service'

export const SearchAppointmentsViewModel = () => {
  const httpClient = HttpClient.create()
  const getPatientByCPFService = GetPatientByCPFService.create(httpClient)
  const getAppointmentsPatientService =
    GetAppointmentsPatientService.create(httpClient)
  const deleteAppointmentService = DeleteAppointmentService.create(httpClient)
  const updateAppointmentService = UpdateAppointmentService.create(httpClient)

  const methods = useSearchAppointmentsModel({
    getPatientByCPFService,
    getAppointmentsPatientService,
    deleteAppointmentService,
    updateAppointmentService
  })

  return <SearchAppointmentsView {...methods} />
}
