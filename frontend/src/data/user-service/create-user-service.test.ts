import { HttpMethod } from './../../infrastructure/contratcs/http-contratcs';
import { User } from "@/domain/models/user";
import { httpClientMockFail, httpClientMockSuccess } from "@/test/mock/httpMock"
import { CreateUserService } from './create-user-service';

const createUserBody: User = {
	name: 'Test User',
  email: 'usertestemail@gmail.com',
  password: '123456789'
}

describe('CreateUserService', () => {
  it('should create a user and return it', async() => {
    const httpMock = httpClientMockSuccess(createUserBody)
    const createUserService = CreateUserService.create(httpMock);
    const CreateUser = await createUserService.exec(createUserBody)

    expect(CreateUser).toBe(createUserBody)
    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/users',
      method: HttpMethod.POST,
      body: createUserBody
    })
  });

  it('should throw an error if user creation fails', async () => {
    const httpMock = httpClientMockFail();
    const createUserService = CreateUserService.create(httpMock);
    await expect(createUserService.exec(createUserBody)).rejects.toThrow('Network error');

    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: '/users',
			method: HttpMethod.POST,
			body: createUserBody,
		})
	})
});
