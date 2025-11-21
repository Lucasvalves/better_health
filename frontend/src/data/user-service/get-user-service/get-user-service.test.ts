import { User } from '@/domain/models/user'
import { HttpMethod } from '@/infrastructure/contratcs/http-contratcs'
import { httpClientMockFail, httpClientMockSuccess } from '@/test/mock/httpMock'
import { GetUserService } from './get-user-service'

const mockUser: User = {
  name: 'User Test',
  email: 'usertestemail@gmail.com',
  password: '123456789',
  avatar_url: 'https://imagemteste.png'
}

const getUserParams = {
  token: 'fake-jwt-token'
}

describe('GetUserService', () => {
  it('should return the logged user data', async () => {
    const httpMock = httpClientMockSuccess(mockUser)
    const getUserService = GetUserService.create(httpMock)

    const response = await getUserService.exec(getUserParams)

    expect(response).toEqual(mockUser)
    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/users',
      method: HttpMethod.GET,
      headers: {
        Authorization: `Bearer ${getUserParams.token}`
      }
    })
  })

  it('should throw an error if retrieving the user fails', async () => {
    const httpMock = httpClientMockFail()
    const getUserService = GetUserService.create(httpMock)

    await expect(getUserService.exec(getUserParams)).rejects.toThrow(
      'Network error'
    )

    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/users',
      method: HttpMethod.GET,
      headers: {
        Authorization: `Bearer ${getUserParams.token}`
      }
    })
  })
})
