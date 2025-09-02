import axios from 'axios'
import { HttpClient } from './http-client'
import { HttpMethod, HttpRequest } from '../contratcs/http-contratcs'


describe('HttpClient - Create User', () => {
  const httpClient = HttpClient.create()

  it('should create a user successfully', async () => {
    const mockResponse = {
      id: '12345',
      name: 'Lucas Veloso',
      email: 'lucas@example.com',
    }

    jest.spyOn(axios, 'request').mockResolvedValueOnce({ data: mockResponse })

    const request: HttpRequest<{ name: string; email: string; password: string }> = {
      endpoint: '/test-endpoint',
      method: HttpMethod.POST,
      body: {
        name: 'Lucas Veloso',
        email: 'lucas@example.com',
        password: '123456',
      },
      headers: { 'Content-Type': 'application/json' },
      url: 'http://localhost:8080',
    }

    const result = await httpClient.sendRequest<typeof mockResponse, typeof request.body>(
      request,
    )

    expect(result).toEqual(mockResponse)
    expect(axios.request).toHaveBeenCalledWith({
      method: HttpMethod.POST,
      headers: { 'Content-Type': 'application/json' },
      data: {
        name: 'Lucas Veloso',
        email: 'lucas@example.com',
        password: '123456',
      },
      url: 'http://localhost:8080/test-endpoint',
      params: undefined,
    })
  })

  it('should handle error when user creation fails', async () => {
    const axiosError = Object.assign(new Error('Request failed with status 400: [object Object]'), {
      response: {
        status: 400,
        data: { error: 'Email already in use' },
      },
    });

    jest.spyOn(axios, 'request').mockRejectedValueOnce(axiosError);

    const request: HttpRequest<{ name: string; email: string; password: string }> = {
      endpoint: '/test-endpoint',
      method: HttpMethod.POST,
      body: {
        name: 'Lucas Veloso',
        email: 'lucas@example.com',
        password: '123456',
      },
      headers: { 'Content-Type': 'application/json' },
      url: 'http://localhost:8080',
    };

    await expect(
      httpClient.sendRequest<{ error: string }, typeof request.body>(request),
    ).rejects.toThrow('Request failed with status 400: [object Object]');

    expect(axios.request).toHaveBeenCalledWith({
      method: HttpMethod.POST,
      headers: { 'Content-Type': 'application/json' },
      data: {
        name: 'Lucas Veloso',
        email: 'lucas@example.com',
        password: '123456',
      },
      url: 'http://localhost:8080/test-endpoint',
      params: undefined,
    });
  });

  it('should fallback to env base URL when url is undefined', async () => {
    const mockResponse = { ok: true }
    const spy = jest.spyOn(axios, 'request').mockResolvedValueOnce({ data: mockResponse })

    const originalEnv = process.env.NEXT_PUBLIC_API_BETTER_HEALTH_URL
    process.env.NEXT_PUBLIC_API_BETTER_HEALTH_URL = 'https://api.example.com'

    const request: HttpRequest = {
      endpoint: '/health',
      method: HttpMethod.GET,
      headers: { Accept: 'application/json' },
    }

    const result = await httpClient.sendRequest<typeof mockResponse>(request)

    expect(result).toEqual(mockResponse)
    expect(spy).toHaveBeenCalledWith({
      method: HttpMethod.GET,
      headers: { Accept: 'application/json' },
      data: undefined,
      url: 'https://api.example.com/health',
      params: undefined,
    })

    process.env.NEXT_PUBLIC_API_BETTER_HEALTH_URL = originalEnv
  })

  it('should send GET request with query params and no body', async () => {
    const mockResponse = { items: [1, 2, 3] }
    jest.spyOn(axios, 'request').mockResolvedValueOnce({ data: mockResponse })

    const request: HttpRequest = {
      endpoint: '/items',
      method: HttpMethod.GET,
      params: { page: 2, pageSize: 10 },
      url: 'http://localhost:3000',
    }

    const result = await httpClient.sendRequest<typeof mockResponse>(request)

    expect(result).toEqual(mockResponse)
    expect(axios.request).toHaveBeenCalledWith({
      method: HttpMethod.GET,
      headers: undefined,
      data: undefined,
      params: { page: 2, pageSize: 10 },
      url: 'http://localhost:3000/items'
    })
  })

  it('should handle network error without response object', async () => {
    const networkError = new Error('Network Error')
    jest.spyOn(axios, 'request').mockRejectedValueOnce(networkError)

    const request: HttpRequest = {
      endpoint: '/unreachable',
      method: HttpMethod.GET,
      url: 'http://localhost:3000',
    }

    await expect(httpClient.sendRequest<unknown>(request)).rejects.toThrow('Network Error')

    expect(axios.request).toHaveBeenCalledWith({
      method: HttpMethod.GET,
      headers: undefined,
      data: undefined,
      url: 'http://localhost:3000/unreachable',
      params: undefined,
    })
  })

  it('should send PUT request with body and headers', async () => {
    const mockResponse = { updated: true }
    jest.spyOn(axios, 'request').mockResolvedValueOnce({ data: mockResponse })

    const request: HttpRequest<{ name: string }> = {
      endpoint: '/users/123',
      method: HttpMethod.PUT,
      body: { name: 'New Name' },
      headers: { 'Content-Type': 'application/json' },
      url: 'https://api.test',
    }

    const result = await httpClient.sendRequest<typeof mockResponse, typeof request.body>(request)

    expect(result).toEqual(mockResponse)
    expect(axios.request).toHaveBeenCalledWith({
      method: HttpMethod.PUT,
      headers: { 'Content-Type': 'application/json' },
      data: { name: 'New Name' },
      url: 'https://api.test/users/123',
      params: undefined,
    })
  })

  it('should send DELETE request with params', async () => {
    const mockResponse = { deleted: true }
    jest.spyOn(axios, 'request').mockResolvedValueOnce({ data: mockResponse })

    const request: HttpRequest = {
      endpoint: '/users/123',
      method: HttpMethod.DELETE,
      params: { hard: 1 },
      url: 'https://api.test',
    }

    const result = await httpClient.sendRequest<typeof mockResponse>(request)

    expect(result).toEqual(mockResponse)
    expect(axios.request).toHaveBeenCalledWith({
      method: HttpMethod.DELETE,
      headers: undefined,
      data: undefined,
      url: 'https://api.test/users/123',
      params: { hard: 1 },
    })
  })
})
