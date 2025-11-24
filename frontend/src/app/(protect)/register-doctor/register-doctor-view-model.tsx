'use client'
import { CreateDoctorService } from '@/data/doctor-service/create-doctor/create-doctor-service'
import { HttpClient } from '@/infrastructure/http/http-client'
import { useRegisterDoctorModel } from './register-doctor-model'
import RegisterDoctorView from './register-doctor-view'
import { GetSpecialtiesService } from '@/data/specialty-service/get-specialties-service/get-specialties-service'

export default function RegisterDoctorViewModel() {
  const httpClient = HttpClient.create()
  const createDoctorService = CreateDoctorService.create(httpClient)
  const getSpecialtiesService = GetSpecialtiesService.create(httpClient)

  const methods = useRegisterDoctorModel({
    createDoctorService,
    getSpecialtiesService
  })

  return <RegisterDoctorView {...methods} />
}
