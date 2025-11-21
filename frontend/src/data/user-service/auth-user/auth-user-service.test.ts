import { HttpMethod } from '@/infrastructure/contratcs/http-contratcs'
import { User } from '@/domain/models/user'
import { httpClientMockFail, httpClientMockSuccess } from '@/test/mock/httpMock'
import { AuthUserService, AuthResponse } from './auth-user-service'

const mockUser: User = {
  email: 'usertestemail@gmail.com',
  password: '123456789',
  name: 'User Test'
}

const mockAuthResponse: AuthResponse = {
  token: 'fake-jwt-token',
  user: mockUser
}

const authUserBody = {
  email: mockUser.email,
  password: mockUser.password
}

describe('AuthUserService', () => {
  it('should authenticate a user and return the token and user data', async () => {
    const httpMock = httpClientMockSuccess(mockAuthResponse)
    const authUserService = AuthUserService.auth(httpMock)

    const response = await authUserService.exec(authUserBody)

    expect(response).toEqual(mockAuthResponse)
    expect(httpMock.sendRequest).toHaveBeenCalledTimes(1)
    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/users/auth',
      method: HttpMethod.POST,
      body: authUserBody
    })
  })

  it('should throw an error if authentication fails', async () => {
    const httpMock = httpClientMockFail()
    const authUserService = AuthUserService.auth(httpMock)

    await expect(authUserService.exec(authUserBody)).rejects.toThrow(
      'Network error'
    )

    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/users/auth',
      method: HttpMethod.POST,
      body: authUserBody
    })
  })
})
