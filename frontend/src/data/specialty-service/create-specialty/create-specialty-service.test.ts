import { HttpMethod } from '@/infrastructure/contratcs/http-contratcs'
import { Specialty } from '@/domain/models/specialty'
import { httpClientMockFail, httpClientMockSuccess } from '@/test/mock/httpMock'
import { CreateSpecialtyService } from './create-specialty-service'

const createSpecialtyBody: Specialty = {
  name: 'Cardiologia'
}

const createParams = {
  body: createSpecialtyBody,
  token: 'fake-jwt-token'
}

describe('CreateSpecialtyService', () => {
  it('should create a specialty and return it', async () => {
    const httpMock = httpClientMockSuccess(createSpecialtyBody)
    const createSpecialtyService = CreateSpecialtyService.create(httpMock)
    const createdSpecialty = await createSpecialtyService.exec(createParams)

    expect(createdSpecialty).toBe(createSpecialtyBody)
    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/specialties',
      method: HttpMethod.POST,
      headers: {
        Authorization: `Bearer ${createParams.token}`
      },
      body: createSpecialtyBody
    })
  })

  it('should throw an error if specialty creation fails', async () => {
    const httpMock = httpClientMockFail()
    const createSpecialtyService = CreateSpecialtyService.create(httpMock)

    await expect(createSpecialtyService.exec(createParams)).rejects.toThrow(
      'Network error'
    )

    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/specialties',
      method: HttpMethod.POST,
      headers: {
        Authorization: `Bearer ${createParams.token}`
      },
      body: createSpecialtyBody
    })
  })
})
