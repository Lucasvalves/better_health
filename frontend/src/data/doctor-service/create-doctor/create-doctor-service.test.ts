import { HttpMethod } from '@/infrastructure/contratcs/http-contratcs'
import { Doctor } from '@/domain/models/doctor'
import { httpClientMockFail, httpClientMockSuccess } from '@/test/mock/httpMock'
import { CreateDoctorService } from './create-doctor-service'

const createDoctorBody: Doctor = {
  name: 'Dr. João Silva',
  crm: '123456',
  specialties_id: 'specialty-id-123'
}

const createParams = {
  body: createDoctorBody,
  token: 'fake-jwt-token'
}

describe('CreateDoctorService', () => {
  it('should create a doctor and return it', async () => {
    const httpMock = httpClientMockSuccess(createDoctorBody)
    const createDoctorService = CreateDoctorService.create(httpMock)
    const createdDoctor = await createDoctorService.exec(createParams)

    expect(createdDoctor).toBe(createDoctorBody)
    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/doctors',
      method: HttpMethod.POST,
      headers: {
        Authorization: `Bearer ${createParams.token}`
      },
      body: createDoctorBody
    })
  })

  it('should throw an error if doctor creation fails', async () => {
    const httpMock = httpClientMockFail()
    const createDoctorService = CreateDoctorService.create(httpMock)

    await expect(createDoctorService.exec(createParams)).rejects.toThrow(
      'Network error'
    )

    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/doctors',
      method: HttpMethod.POST,
      headers: {
        Authorization: `Bearer ${createParams.token}`
      },
      body: createDoctorBody
    })
  })
})

