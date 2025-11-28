import { GetDoctorByCRMResponse } from '@/domain/models/doctor'
import { HttpMethod } from '@/infrastructure/contratcs/http-contratcs'
import { httpClientMockFail, httpClientMockSuccess } from '@/test/mock/httpMock'
import { GetDoctorByCRMService } from './get-doctor-by-crm-service'

const doctorByCrmResponse: GetDoctorByCRMResponse = {
  id: 'doctor-id',
  name: 'Dr. John Doe',
  crm: 'CRM-0001',
  specialties_id: 'specialty-id'
}

const getDoctorByCrmParams = {
  crm: 'CRM-0001',
  token: 'fake-jwt-token'
}

describe('GetDoctorByCRMService', () => {
  it('should fetch a doctor using the CRM', async () => {
    const httpMock = httpClientMockSuccess(doctorByCrmResponse)
    const service = GetDoctorByCRMService.create(httpMock)

    const doctor = await service.exec(getDoctorByCrmParams)

    expect(doctor).toEqual(doctorByCrmResponse)
    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: `/doctors/crm/`,
      method: HttpMethod.POST,
      body: { crm: getDoctorByCrmParams.crm },
      headers: {
        Authorization: `Bearer ${getDoctorByCrmParams.token}`
      }
    })
  })

  it('should throw when fetching doctor by CRM fails', async () => {
    const httpMock = httpClientMockFail()
    const service = GetDoctorByCRMService.create(httpMock)

    await expect(service.exec(getDoctorByCrmParams)).rejects.toThrow(
      'Network error'
    )

    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: `/doctors/crm/`,
      method: HttpMethod.POST,
      body: { crm: getDoctorByCrmParams.crm },
      headers: {
        Authorization: `Bearer ${getDoctorByCrmParams.token}`
      }
    })
  })
})
