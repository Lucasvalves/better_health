import axios, { AxiosInstance } from 'axios'
import { IHttpClient, HttpRequest } from '../contratcs/http-contratcs'

export class HttpClient implements IHttpClient {
  constructor(private api: AxiosInstance) {}

  static create(): HttpClient {
    return new HttpClient(axios)
  }

  async sendRequest<TResponse, TBody = unknown>(
    props: HttpRequest<TBody>
  ): Promise<TResponse> {
    const { endpoint, method, body, headers, params, url } = props

    const baseUrl = url ?? process.env.NEXT_PUBLIC_API_BETTER_HEALTH_URL ?? ''
    try {
      const data = await this.api.request<TResponse>({
        method,
        headers,
        data: body,
        url: `${baseUrl}${endpoint}`,
        params
      })

      return data.data
    } catch (err) {
      throw err
    }
  }
}
