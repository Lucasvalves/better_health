import { Specialty } from '@/domain/models/specialty'
import { HttpMethod } from '@/infrastructure/contratcs/http-contratcs'
import { httpClientMockFail, httpClientMockSuccess } from '@/test/mock/httpMock'
import { GetSpecialtiesService } from './get-specialties-service'

const mockSpecialties: Specialty[] = [
  { id: '1', name: 'Cardiologia' },
  { id: '2', name: 'Dermatologia' }
]

const getSpecialtiesParams = {
  token: 'fake-jwt-token'
}

describe('GetSpecialtiesService', () => {
  it('should fetch specialties list successfully', async () => {
    const httpMock = httpClientMockSuccess(mockSpecialties)
    const service = GetSpecialtiesService.create(httpMock)

    const specialties = await service.exec(getSpecialtiesParams)

    expect(specialties).toEqual(mockSpecialties)
    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/specialties',
      method: HttpMethod.GET,
      headers: {
        Authorization: `Bearer ${getSpecialtiesParams.token}`
      }
    })
  })

  it('should throw an error if fetching specialties fails', async () => {
    const httpMock = httpClientMockFail()
    const service = GetSpecialtiesService.create(httpMock)

    await expect(service.exec(getSpecialtiesParams)).rejects.toThrow(
      'Network error'
    )

    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/specialties',
      method: HttpMethod.GET,
      headers: {
        Authorization: `Bearer ${getSpecialtiesParams.token}`
      }
    })
  })
})
