import { User, UpdateUserBody } from '@/domain/models/user'
import { HttpMethod } from '@/infrastructure/contratcs/http-contratcs'
import { httpClientMockFail, httpClientMockSuccess } from '@/test/mock/httpMock'
import { UpdateUserService } from './update-user-service'

const mockUser: User = {
  name: 'User Test',
  email: 'usertestemail@gmail.com',
  password: '123456789'
}

const updateBody: UpdateUserBody = {
  oldPassword: 'old_password',
  newPassword: 'new_password'
}

const updateParams = {
  body: updateBody,
  token: 'fake-jwt-token'
}

describe('UpdateUserService', () => {
  it('should update the user and return the updated data', async () => {
    const httpMock = httpClientMockSuccess(mockUser)
    const updateUserService = UpdateUserService.create(httpMock)

    const response = await updateUserService.exec(updateParams)

    expect(response).toEqual(mockUser)
    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/users',
      method: HttpMethod.PUT,
      headers: {
        Authorization: `Bearer ${updateParams.token}`
      },
      body: updateBody
    })
  })

  it('should throw an error if the update fails', async () => {
    const httpMock = httpClientMockFail()
    const updateUserService = UpdateUserService.create(httpMock)

    await expect(updateUserService.exec(updateParams)).rejects.toThrow(
      'Network error'
    )

    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/users',
      method: HttpMethod.PUT,
      headers: {
        Authorization: `Bearer ${updateParams.token}`
      },
      body: updateBody
    })
  })
})
