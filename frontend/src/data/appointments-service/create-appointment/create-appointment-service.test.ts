import { Appointment } from '@/domain/models/appointment'
import { HttpMethod } from '@/infrastructure/contratcs/http-contratcs'
import { httpClientMockFail, httpClientMockSuccess } from '@/test/mock/httpMock'
import { CreateAppointmentService } from './create-appointment-service'

const appointmentBody: Appointment = {
  date: new Date('2025-01-15T09:00:00.000Z'),
  doctors_id: 'doctor-id',
  patients_id: 'patient-id',
  specialties_id: 'specialty-id'
}

const createAppointmentParams = {
  body: appointmentBody,
  token: 'fake-jwt-token'
}

describe('CreateAppointmentService', () => {
  it('should create an appointment and return it', async () => {
    const httpMock = httpClientMockSuccess(appointmentBody)
    const service = CreateAppointmentService.create(httpMock)

    const createdAppointment = await service.exec(createAppointmentParams)

    expect(createdAppointment).toBe(appointmentBody)
    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/appointments',
      method: HttpMethod.POST,
      body: appointmentBody,
      headers: {
        Authorization: `Bearer ${createAppointmentParams.token}`
      }
    })
  })

  it('should throw an error when appointment creation fails', async () => {
    const httpMock = httpClientMockFail()
    const service = CreateAppointmentService.create(httpMock)

    await expect(service.exec(createAppointmentParams)).rejects.toThrow(
      'Network error'
    )

    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/appointments',
      method: HttpMethod.POST,
      body: appointmentBody,
      headers: {
        Authorization: `Bearer ${createAppointmentParams.token}`
      }
    })
  })
})
