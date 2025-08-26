import { User } from '@/domain/models/user'
import { HttpMethod, IHttpClient } from '@/infrastructure/contratcs/http-contratcs';

export type CreateUserBody = Omit<User, 'id'>


export type CreateUserServiceContract = {
    exec: (body: CreateUserBody) => Promise<User>
}

export class CreateUserService implements CreateUserServiceContract{
    private  constructor(private readonly HttpClient: IHttpClient){}

    static create(HttpClient: IHttpClient): CreateUserService {
        return new CreateUserService(HttpClient)
    }

    async exec(body: CreateUserBody): Promise<User> {
        const createUser = await this.HttpClient.sendRequest<User, CreateUserBody>({
                endpoint: "/users",
                method: HttpMethod.POST,
                body
        })

        return createUser
    }

}

