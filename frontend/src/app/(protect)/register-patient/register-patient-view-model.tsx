'use client'
import { CreatePatientService } from '@/data/patient-service/create-patient/create-patient-service'
import { HttpClient } from '@/infrastructure/http/http-client'
import { useRegisterPatientModel } from './register-patient-model'
import RegisterPatientView from './register-patient-view'

export default function RegisterPatientViewModel() {
  const httpClient = HttpClient.create()
  const createPatientService = CreatePatientService.create(httpClient)

  const methods = useRegisterPatientModel({
    createPatientService
  })

  return <RegisterPatientView {...methods} />
}
