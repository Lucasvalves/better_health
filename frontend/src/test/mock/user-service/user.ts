import { AuthResponse, AuthUserBody, AuthUserServiceContract } from '@/data/user-service/auth-user/auth-user-service'
import {
  CreateUserBody,
  CreateUserServiceContract
} from '@/data/user-service/create-user-service/create-user-service'
import { User } from '@/domain/models/user'

export class InMemoryCreateUserService implements CreateUserServiceContract {
  async exec(body: CreateUserBody): Promise<User> {
    const createdUser: User = { ...body }

    return createdUser
  }
}
export class InMemoryAuthUserService implements AuthUserServiceContract{
  async exec(body: AuthUserBody): Promise<AuthResponse>{
    const authUser: AuthResponse = {
      user: body,
      token: '12345adcde'
    }

    return authUser
  }
}
