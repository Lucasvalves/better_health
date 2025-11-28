'use client'
import { GetSpecialtiesService } from '@/data/specialty-service/get-specialties-service/get-specialties-service'
import { useAppointmentsModel } from './appointments-model'
import AppointmentsView from './appointments-view'
import { HttpClient } from '@/infrastructure/http/http-client'
import { GetPatientByCPFService } from '@/data/patient-service/get-patient/get-patient-by-cpf-service'
import { GetAvailableDaysService } from '@/data/appointments-service/get-specialties-service/get-available-days-service'
import { CreateAppointmentService } from '@/data/appointments-service/create-appointment/create-appointment-service'
import { getDoctorByIDServiceService } from '@/data/doctor-service/get-doctor/get-doctor-by-id/get-doctor-by-id-service'

export const AppointmentsViewModel = () => {
  const httpClient = HttpClient.create()
  const getPatientByCPFService = GetPatientByCPFService.create(httpClient)
  const getSpecialtiesService = GetSpecialtiesService.create(httpClient)
  const getAvailableDaysService = GetAvailableDaysService.create(httpClient)
  const createAppointmentService = CreateAppointmentService.create(httpClient)
  const getDoctorByCRMService = getDoctorByIDServiceService.create(httpClient)

  const methods = useAppointmentsModel({
    getSpecialtiesService,
    getPatientByCPFService,
    getAvailableDaysService,
    createAppointmentService,
    getDoctorByCRMService
  })

  return <AppointmentsView {...methods} />
}
