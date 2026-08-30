import { AppointmentsPatientResponse } from '@/domain/models/appointment'
import { HttpMethod } from '@/infrastructure/contratcs/http-contratcs'
import { httpClientMockFail, httpClientMockSuccess } from '@/test/mock/httpMock'
import { UpdateAppointmentService } from './update-appointment-service'

const mockResponse: AppointmentsPatientResponse = {
  id: 'appointment-id-123',
  patients_id: 'patient-id',
  doctors_id: 'doctor-id',
  date: new Date('2025-12-10T10:00:00.000Z'),
  specialties_id: 'specialty-id',
}

const updateParams = {
  id: 'appointment-id-123',
  token: 'fake-jwt-token',
  newDate: '2025-12-10T10:00:00.000Z'
}

describe('UpdateAppointmentService', () => {
  it('should update an appointment date and return updated appointments', async () => {
    const httpMock = httpClientMockSuccess(mockResponse)
    const service = UpdateAppointmentService.create(httpMock)

    const response = await service.exec(updateParams)

    expect(response).toBe(mockResponse)
    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: `/appointments/${updateParams.id}`,
      method: HttpMethod.DELETE,
      headers: {
        Authorization: `Bearer ${updateParams.token}`
      },
      body: { newDate: updateParams.newDate }
    })
  })

  it('should throw an error if updating appointment fails', async () => {
    const httpMock = httpClientMockFail()
    const service = UpdateAppointmentService.create(httpMock)

    await expect(service.exec(updateParams)).rejects.toThrow('Network error')

    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: `/appointments/${updateParams.id}`,
      method: HttpMethod.DELETE,
      headers: {
        Authorization: `Bearer ${updateParams.token}`
      },
      body: { newDate: updateParams.newDate }
    })
  })
})
