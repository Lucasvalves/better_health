import {
  AvailableDaysResponse,
  GetAvailableDaysBody
} from '@/domain/models/appointment'
import { HttpMethod } from '@/infrastructure/contratcs/http-contratcs'
import { httpClientMockFail, httpClientMockSuccess } from '@/test/mock/httpMock'
import { GetAvailableDaysService } from './get-available-days-service'

const body: GetAvailableDaysBody = {
  date: new Date('2025-12-10T10:00:00.000Z'),
  specialties_id: 'specialty-id'
}

const mockAvailableDays: AvailableDaysResponse = {
  doctrs: ['doctor-id'],
  schedule: [
    {
      '04-12-2025': {
        'doctor-id': [
          ['13:00', '13:30'],
          ['14:00', '14:30'],
          ['15:00', '15:30'],
          ['16:00', '16:30']
        ]
      }
    }
  ]
}

const getAvailableDaysParams = {
  body,
  token: 'fake-jwt-token'
}

describe('GetAvailableDaysService', () => {
  it('should fetch available days successfully', async () => {
    const httpMock = httpClientMockSuccess(mockAvailableDays)
    const service = GetAvailableDaysService.create(httpMock)

    const response = await service.exec(getAvailableDaysParams)

    expect(response).toEqual(mockAvailableDays)
    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/appointments/available-days',
      method: HttpMethod.POST,
      headers: {
        Authorization: `Bearer ${getAvailableDaysParams.token}`
      },
      body
    })
  })

  it('should throw an error if fetching available days fails', async () => {
    const httpMock = httpClientMockFail()
    const service = GetAvailableDaysService.create(httpMock)

    await expect(service.exec(getAvailableDaysParams)).rejects.toThrow(
      'Network error'
    )

    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/appointments/available-days',
      method: HttpMethod.POST,
      headers: {
        Authorization: `Bearer ${getAvailableDaysParams.token}`
      },
      body
    })
  })
})
