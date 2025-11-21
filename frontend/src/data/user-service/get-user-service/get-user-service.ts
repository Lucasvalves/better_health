import { User } from '@/domain/models/user'
import {
  HttpMethod,
  IHttpClient
} from '@/infrastructure/contratcs/http-contratcs'

export type GetUser = {
  token: string
}

export type GetUserServiceContract = {
  exec: ({ token }: GetUser) => Promise<User>
}

export class GetUserService implements GetUserServiceContract {
  private constructor(private readonly HttpClient: IHttpClient) {}

  static create(HttpClient: IHttpClient): GetUserService {
    return new GetUserService(HttpClient)
  }

  async exec({ token }: GetUser): Promise<User> {
    const loggedUser = await this.HttpClient.sendRequest<User>({
      endpoint: '/users',
      method: HttpMethod.GET,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return loggedUser
  }
}
