'use client'
import { CreateSpecialtyService } from '@/data/specialty-service/create-specialty/create-specialty-service'
import { HttpClient } from '@/infrastructure/http/http-client'
import { useRegisterSpecialtyModel } from './register-specialty-model'
import RegisterSpecialtyView from './register-specialty-view'

export default function RegisterSpecialtyViewModel() {
  const httpClient = HttpClient.create()
  const createSpecialtyService = CreateSpecialtyService.create(httpClient)

  const methods = useRegisterSpecialtyModel({
    createSpecialtyService
  })

  return <RegisterSpecialtyView {...methods} />
}
