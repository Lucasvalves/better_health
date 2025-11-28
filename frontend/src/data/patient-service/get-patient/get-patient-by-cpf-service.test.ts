import { Patient } from '@/domain/models/patient'
import { HttpMethod } from '@/infrastructure/contratcs/http-contratcs'
import { httpClientMockFail, httpClientMockSuccess } from '@/test/mock/httpMock'
import { GetPatientByCPFService } from './get-patient-by-cpf-service'

const mockPatient: Patient = {
  id: 'patient-id',
  name: 'Jane Patient',
  cpf: '12345678900',
  phone: '(11) 99999-9999'
}

const getPatientByCpfParams = {
  cpf: '12345678900',
  token: 'fake-jwt-token'
}

describe('GetPatientByCPFService', () => {
  it('should fetch a patient by CPF', async () => {
    const httpMock = httpClientMockSuccess(mockPatient)
    const service = GetPatientByCPFService.create(httpMock)

    const patient = await service.exec(getPatientByCpfParams)

    expect(patient).toEqual(mockPatient)
    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: `/patients/cpf/`,
      method: HttpMethod.POST,
      body: { cpf: getPatientByCpfParams.cpf },
      headers: {
        Authorization: `Bearer ${getPatientByCpfParams.token}`
      }
    })
  })

  it('should throw when fetching patient by CPF fails', async () => {
    const httpMock = httpClientMockFail()
    const service = GetPatientByCPFService.create(httpMock)

    await expect(service.exec(getPatientByCpfParams)).rejects.toThrow(
      'Network error'
    )

    expect(httpMock.sendRequest).toHaveBeenCalledWith({
      endpoint: `/patients/cpf/`,
      method: HttpMethod.POST,
      body: { cpf: getPatientByCpfParams.cpf },
      headers: {
        Authorization: `Bearer ${getPatientByCpfParams.token}`
      }
    })
  })
})
