import { HttpMethod } from '@/infrastructure/contratcs/http-contratcs'
import { Patient } from '@/domain/models/patient'
import { httpClientMockFail, httpClientMockSuccess } from '@/test/mock/httpMock'
import { CreatePatientService } from './create-patient-service'

const createPatientBody: Patient = {
  name: 'João Silva',
  cpf: '123.456.789-00',
  phone: '(11) 98765-4321'
}

const createParams = {
  body: createPatientBody,
  token: 'fake-jwt-token'
}

describe('CreatePatientService', () => {
  it('should create a patient and return it', async () => {
    const httpMock = httpClientMockSuccess(createPatientBody)
    const createPatientService = CreatePatientService.create(httpMock)
    const createdPatient = await createPatientService.exec(createParams)

    expect(createdPatient).toBe(createPatientBody)
    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/patients',
      method: HttpMethod.POST,
      headers: {
        Authorization: `Bearer ${createParams.token}`
      },
      body: createPatientBody
    })
  })

  it('should throw an error if patient creation fails', async () => {
    const httpMock = httpClientMockFail()
    const createPatientService = CreatePatientService.create(httpMock)

    await expect(createPatientService.exec(createParams)).rejects.toThrow(
      'Network error'
    )

    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/patients',
      method: HttpMethod.POST,
      headers: {
        Authorization: `Bearer ${createParams.token}`
      },
      body: createPatientBody
    })
  })
})

