'use client'
import { GetDoctorByCRMService } from '@/data/doctor-service/get-doctor/get-doctor-by-crm/get-doctor-by-crm-service'
import { useScheduleModel } from './schedule-model'
import ScheduleView from './schedule-view'
import { HttpClient } from '@/infrastructure/http/http-client'
import { CreateScheduleService } from '@/data/schedule-service/create-times-service/create-schedule-service'

export const ScheduleViewModel = () => {
  const httpClient = HttpClient.create()
  const getDoctorByCRMService = GetDoctorByCRMService.create(httpClient)
  const createScheduleService = CreateScheduleService.create(httpClient)

  const methods = useScheduleModel({
    getDoctorByCRMService,
    createScheduleService
  })

  return <ScheduleView {...methods} />
}
