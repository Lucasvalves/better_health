import { Schedule } from '@/domain/models/schedule'
import { HttpMethod } from '@/infrastructure/contratcs/http-contratcs'
import { httpClientMockFail, httpClientMockSuccess } from '@/test/mock/httpMock'
import { CreateScheduleService } from './create-schedule-service'

const createScheduleBody: Schedule = {
  days: 1,
  startHour: '08:00',
  endHour: '18:00',
  specialties_id: 'specialty-id',
  doctors_id: 'doctor-id'
}

const createParams = {
  body: createScheduleBody,
  token: 'fake-jwt-token'
}

describe('CreateScheduleService', () => {
  it('should create a schedule and return it', async () => {
    const httpMock = httpClientMockSuccess(createScheduleBody)
    const createScheduleService = CreateScheduleService.create(httpMock)
    const createdSchedule = await createScheduleService.exec(createParams)

    expect(createdSchedule).toBe(createScheduleBody)
    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/times',
      method: HttpMethod.POST,
      headers: {
        Authorization: `Bearer ${createParams.token}`
      },
      body: createScheduleBody
    })
  })

  it('should throw an error if schedule creation fails', async () => {
    const httpMock = httpClientMockFail()
    const createScheduleService = CreateScheduleService.create(httpMock)

    await expect(createScheduleService.exec(createParams)).rejects.toThrow(
      'Network error'
    )

    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/times',
      method: HttpMethod.POST,
      headers: {
        Authorization: `Bearer ${createParams.token}`
      },
      body: createScheduleBody
    })
  })
})
