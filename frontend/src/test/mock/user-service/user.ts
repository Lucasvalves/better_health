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
