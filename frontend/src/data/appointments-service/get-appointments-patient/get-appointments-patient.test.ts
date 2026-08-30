import { AppointmentsPatientResponse } from '@/domain/models/appointment'
import { HttpMethod } from '@/infrastructure/contratcs/http-contratcs'
import { httpClientMockFail, httpClientMockSuccess } from '@/test/mock/httpMock'
import { GetAppointmentsPatientService } from './get-appointments-patient'

const mockResponse: AppointmentsPatientResponse = {
  id: 'appointment-id-123',
  patients_id: 'patient-id',
  doctors_id: 'doctor-id',
  date: new Date('2025-12-10T10:00:00.000Z'),
  specialties_id: 'specialty-id'
}

const getAppointmentsParams = {
  patient_id: 'patient-id',
  token: 'fake-jwt-token'
}

describe('GetAppointmentsPatientService', () => {
  it('should fetch appointments by patient successfully', async () => {
    const httpMock = httpClientMockSuccess(mockResponse)
    const service = GetAppointmentsPatientService.create(httpMock)

    const response = await service.exec(getAppointmentsParams)

    expect(response).toEqual(mockResponse)
    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/appointments/appointments-patient',
      method: HttpMethod.POST,
      headers: {
        Authorization: `Bearer ${getAppointmentsParams.token}`
      },
      body: { patient_id: getAppointmentsParams.patient_id }
    })
  })

  it('should throw an error if fetching appointments by patient fails', async () => {
    const httpMock = httpClientMockFail()
    const service = GetAppointmentsPatientService.create(httpMock)

    await expect(service.exec(getAppointmentsParams)).rejects.toThrow(
      'Network error'
    )

    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/appointments/appointments-patient',
      method: HttpMethod.POST,
      headers: {
        Authorization: `Bearer ${getAppointmentsParams.token}`
      },
      body: { patient_id: getAppointmentsParams.patient_id }
    })
  })
})
