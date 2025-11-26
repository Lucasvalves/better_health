import { GetDoctorByCRMResponse } from '@/domain/models/doctor'
import { HttpMethod } from '@/infrastructure/contratcs/http-contratcs'
import { httpClientMockFail, httpClientMockSuccess } from '@/test/mock/httpMock'
import { GetDoctorByCRMService } from './get-doctor-by-crm-service'

const mockDoctor: GetDoctorByCRMResponse = {
  id: 'doctor-id',
  name: 'Doctor Test',
  crm: '123456',
  specialties_id:'specialties-id',
  Specialties: {
    id: 'specialties-id',
    name: 'specialties-test'
  }
  
}

const getDoctorParams = {
  token: 'fake-jwt-token',
  crm: mockDoctor.crm
}

describe('GetDoctorByCRMService', () => {
  it('should return a doctor by CRM', async () => {
    const httpMock = httpClientMockSuccess(mockDoctor)
    const getDoctorByCRMService = GetDoctorByCRMService.create(httpMock)

    const response = await getDoctorByCRMService.exec(getDoctorParams)

    expect(response).toEqual(mockDoctor)
    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/doctors/crm/',
      method: HttpMethod.POST,
      headers: {
        Authorization: `Bearer ${getDoctorParams.token}`
      },
      body: { crm: getDoctorParams.crm }
    })
  })

  it('should throw an error if retrieving the doctor fails', async () => {
    const httpMock = httpClientMockFail()
    const getDoctorByCRMService = GetDoctorByCRMService.create(httpMock)

    await expect(getDoctorByCRMService.exec(getDoctorParams)).rejects.toThrow(
      'Network error'
    )

    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/doctors/crm/',
      method: HttpMethod.POST,
      headers: {
        Authorization: `Bearer ${getDoctorParams.token}`
      },
      body: { crm: getDoctorParams.crm }
    })
  })
})
