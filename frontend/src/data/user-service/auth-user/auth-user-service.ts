import { HttpClient } from '@/infrastructure/http/http-client'
import { User } from '@/domain/models/user'
import {
  HttpMethod,
  IHttpClient
} from '@/infrastructure/contratcs/http-contratcs'
export type AuthUserBody = Omit<User, 'id'>

export type AuthResponse = {
  token: string
  user: User
}

export type AuthUserServiceContract = {
  exec: (body: AuthUserBody) => Promise<AuthResponse>
}

export class AuthUserService implements AuthUserServiceContract {
  private constructor(private readonly HttpClient: IHttpClient) {}

  static auth(HttpClient: HttpClient): AuthUserService {
    return new AuthUserService(HttpClient)
  }

  async exec(body: AuthUserBody): Promise<AuthResponse> {
    const authUser = await this.HttpClient.sendRequest<
      AuthResponse,
      AuthUserBody
    >({
      endpoint: '/users/auth',
      method: HttpMethod.POST,
      body
    })
    return authUser
  }
}
