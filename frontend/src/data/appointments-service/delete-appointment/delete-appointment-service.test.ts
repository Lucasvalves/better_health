import { HttpMethod } from '@/infrastructure/contratcs/http-contratcs'
import { AppointmentsPatientResponse } from '@/domain/models/appointment'
import { httpClientMockFail, httpClientMockSuccess } from '@/test/mock/httpMock'
import { DeleteAppointmentService } from './delete-appointment-service'

const mockResponse: AppointmentsPatientResponse = {
  id: 'appointment-id-123',
  patients_id: 'patient-id',
  doctors_id: 'doctor-id',
  date: new Date('2025-12-10T10:00:00.000Z'),
  specialties_id: 'specialty-id'
}
const deleteParams = {
  id: 'appointment-id-123',
  token: 'fake-jwt-token'
}

describe('DeleteAppointmentService', () => {
  it('should delete an appointment and return updated appointments list', async () => {
    const httpMock = httpClientMockSuccess(mockResponse)
    const service = DeleteAppointmentService.create(httpMock)

    const response = await service.exec(deleteParams)

    expect(response).toBe(mockResponse)
    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: `/appointments/${deleteParams.id}`,
      method: HttpMethod.DELETE,
      headers: {
        Authorization: `Bearer ${deleteParams.token}`
      }
    })
  })

  it('should throw an error if deleting appointment fails', async () => {
    const httpMock = httpClientMockFail()
    const service = DeleteAppointmentService.create(httpMock)

    await expect(service.exec(deleteParams)).rejects.toThrow('Network error')

    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: `/appointments/${deleteParams.id}`,
      method: HttpMethod.DELETE,
      headers: {
        Authorization: `Bearer ${deleteParams.token}`
      }
    })
  })
})
