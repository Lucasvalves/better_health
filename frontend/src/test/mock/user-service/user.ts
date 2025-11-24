import {
  AuthResponse,
  AuthUserBody,
  AuthUserServiceContract
} from '@/data/user-service/auth-user/auth-user-service'
import {
  CreateUserBody,
  CreateUserServiceContract
} from '@/data/user-service/create-user-service/create-user-service'
import {
  GetUser,
  GetUserServiceContract
} from '@/data/user-service/get-user-service/get-user-service'
import { UpdateUserServiceContract } from '@/data/user-service/update-user-service/update-user-service'
import { UpdateUser, UpdateUserBody, User } from '@/domain/models/user'

export class InMemoryCreateUserService implements CreateUserServiceContract {
  async exec(body: CreateUserBody): Promise<User> {
    const createdUser: User = { ...body }

    return createdUser
  }
}
export class InMemoryAuthUserService implements AuthUserServiceContract {
  async exec(body: AuthUserBody): Promise<AuthResponse> {
    const authUser: AuthResponse = {
      user: body,
      token: '12345adcde'
    }

    return authUser
  }
}
export class InMemoryGetUserService implements GetUserServiceContract {
  async exec({ token }: GetUser): Promise<User> {
    if (!token) {
      throw new Error('Token not found')
    }

    const getUser = {
      name: 'User Test',
      password: '123456789',
      email: 'user@test.com',
      avatar_url: 'mock-avatar-url.jpg'
    }

    return getUser
  }
}
export class InMemoryUpdateUserService implements UpdateUserServiceContract {
  async exec({ body, token }: UpdateUser): Promise<User> {
    if (!token) {
      throw new Error('Token not found')
    }

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
    const data: Record<string, unknown> = {}

    if (payload instanceof FormData) {
      payload.forEach((value, key) => {
        data[key] = value
      })
    } else {
      Object.assign(data, payload)
    }

    const mockUser: User = {
      name: 'User Test',
      password: (data.newPassword as string) ?? '123456789',
      email: 'user@test.com',
      avatar_url: (data.avatar_url as string) ?? 'mock-avatar-url.jpg'
    }

    return mockUser
  }
}
