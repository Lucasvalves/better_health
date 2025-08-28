export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export type HttpRequest<TBody = unknown> = {
  endpoint: string
  method: HttpMethod
  body?: TBody
  headers?: Record<string, number | string>
  params?: Record<string, number | string>
}

export interface IHttpClient {
  sendRequest: <TResponse, TBody = unknown>(
    request: HttpRequest<TBody>
  ) => Promise<TResponse>
}
