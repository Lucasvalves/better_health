import { getDoctorByIDServiceResponse } from '@/domain/models/doctor'
import { HttpMethod } from '@/infrastructure/contratcs/http-contratcs'
import { httpClientMockFail, httpClientMockSuccess } from '@/test/mock/httpMock'
import { getDoctorByIDServiceService } from './get-doctor-by-id-service'

const doctorResponse: getDoctorByIDServiceResponse = {
  id: 'doctor-id',
  name: 'Dr. Jane Doe',
  crm: 'CRM12345',
  specialties_id: 'specialty-id'
}

const getDoctorByIdParams = {
  id: 'doctor-id',
  token: 'fake-jwt-token'
}

describe('getDoctorByIDServiceService', () => {
  it('should fetch a doctor by id', async () => {
    const httpMock = httpClientMockSuccess(doctorResponse)
    const service = getDoctorByIDServiceService.create(httpMock)

    const doctor = await service.exec(getDoctorByIdParams)

    expect(doctor).toEqual(doctorResponse)
    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: `/doctors/${getDoctorByIdParams.id}`,
      method: HttpMethod.GET,
      headers: {
        Authorization: `Bearer ${getDoctorByIdParams.token}`
      }
    })
  })

  it('should throw if fetching doctor fails', async () => {
    const httpMock = httpClientMockFail()
    const service = getDoctorByIDServiceService.create(httpMock)

    await expect(service.exec(getDoctorByIdParams)).rejects.toThrow(
      'Network error'
    )

    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: `/doctors/${getDoctorByIdParams.id}`,
      method: HttpMethod.GET,
      headers: {
        Authorization: `Bearer ${getDoctorByIdParams.token}`
      }
    })
  })
})
