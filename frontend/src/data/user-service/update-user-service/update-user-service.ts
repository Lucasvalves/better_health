import { UpdateUser, UpdateUserBody, User } from '@/domain/models/user'
import {
  HttpMethod,
  IHttpClient
} from '@/infrastructure/contratcs/http-contratcs'

export type UpdateUserServiceContract = {
  exec: ({ body, token }: UpdateUser) => Promise<User>
}

export class UpdateUserService implements UpdateUserServiceContract {
  private constructor(private readonly HttpClient: IHttpClient) {}

  static create(HttpClient: IHttpClient): UpdateUserService {
    return new UpdateUserService(HttpClient)
  }

  async exec({ body, token }: UpdateUser): Promise<User> {
    let payload: UpdateUserBody | FormData

    if (body instanceof FormData) {
      payload = body
    } else if (body.avatar_url instanceof File) {
      const formData = new FormData()
      formData.append('avatar_url', body.avatar_url)
      if (body.oldPassword) formData.append('oldPassword', body.oldPassword)
      if (body.newPassword) formData.append('newPassword', body.newPassword)
      payload = formData
    } else {
      payload = body
    }
    const updateUser = await this.HttpClient.sendRequest<
      User,
      UpdateUserBody | FormData
    >({
      endpoint: '/users',
      method: HttpMethod.PUT,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: payload
    })

    return updateUser
  }
}
