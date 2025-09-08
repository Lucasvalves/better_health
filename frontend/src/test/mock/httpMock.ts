import { IHttpClient } from '@/infrastructure/contratcs/http-contratcs';
import axios from 'axios';

export const mockResponse = 'Success'

export const httpClientMockSuccess = (data: unknown) => {
	return {
		sendRequest: jest.spyOn(axios, 'request').mockResolvedValueOnce(data),
	} as unknown as IHttpClient;
}

export const httpClientMockFail = () => {
  return {
    sendRequest: jest.spyOn(axios, 'request').mockRejectedValueOnce(new Error('Network error')),
  } as unknown as IHttpClient;
}
