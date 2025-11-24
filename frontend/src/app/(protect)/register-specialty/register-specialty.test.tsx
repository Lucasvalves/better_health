import { jest } from '@jest/globals'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Cookies from 'js-cookie'
import { enqueueSnackbar } from 'notistack'
import { AxiosError } from 'axios'

import { renderView } from '@/test/mock/react-query/renderScreen'
import RegisterSpecialtyView from './register-specialty-view'
import { useRegisterSpecialtyModel } from './register-specialty-model'
import { InMemoryCreateSpecialtyService } from '@/test/mock/specialty-service/specialty'

jest.mock('js-cookie', () => ({
  get: jest.fn()
}))

jest.mock('notistack', () => ({
  enqueueSnackbar: jest.fn()
}))

const MakeSut = () => {
  const createSpecialtyService = new InMemoryCreateSpecialtyService()
  const methods = useRegisterSpecialtyModel({ createSpecialtyService })

  return <RegisterSpecialtyView {...methods} />
}

describe('RegisterSpecialtyView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(Cookies.get as jest.Mock).mockReturnValue('mock-token')
  })

  it('should render register specialty form', () => {
    renderView(<MakeSut />)

    expect(screen.getByText('Cadastrar Especialidade')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Oftamologista')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })

  it('should update specialty name field', async () => {
    renderView(<MakeSut />)

    const input = screen.getByPlaceholderText(
      'Oftamologista'
    ) as HTMLInputElement

    await userEvent.type(input, 'Cardiologia')

    expect(input).toHaveValue('Cardiologia')
  })

  it('should submit form and call service with correct payload', async () => {
    const createService = new InMemoryCreateSpecialtyService()
    const execSpy = jest.spyOn(createService, 'exec')

    const TestComponent = () => {
      const methods = useRegisterSpecialtyModel({
        createSpecialtyService: createService
      })
      return <RegisterSpecialtyView {...methods} />
    }

    renderView(<TestComponent />)

    const input = screen.getByPlaceholderText('Oftamologista')
    await userEvent.type(input, 'Cardiologia')

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(execSpy).toHaveBeenCalledWith({
        body: { name: 'Cardiologia' },
        token: 'mock-token'
      })
    })
  })

  it('should show success message after creating specialty', async () => {
    renderView(<MakeSut />)

    const input = screen.getByPlaceholderText('Oftamologista')
    await userEvent.type(input, 'Ortopedia')

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        'Especialidade criado com sucesso!',
        { variant: 'success' }
      )
    })
  })

  it('should show validation warning when name is empty', async () => {
    renderView(<MakeSut />)

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        'O nome da especialidade é obrigatório.',
        { variant: 'warning' }
      )
    })
  })

  it('should show error message when service fails', async () => {
    const createService = new InMemoryCreateSpecialtyService()
    const errorMessage = 'Erro ao criar especialidade'

    jest.spyOn(createService, 'exec').mockRejectedValueOnce({
      response: {
        data: { message: errorMessage }
      }
    } as AxiosError)

    const TestComponent = () => {
      const methods = useRegisterSpecialtyModel({
        createSpecialtyService: createService
      })
      return <RegisterSpecialtyView {...methods} />
    }

    renderView(<TestComponent />)

    const input = screen.getByPlaceholderText('Oftamologista')
    await userEvent.type(input, 'Dermatologia')

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(errorMessage, {
        variant: 'error'
      })
    })
  })

  it('should show default error message when service fails without response', async () => {
    const createService = new InMemoryCreateSpecialtyService()

    jest.spyOn(createService, 'exec').mockRejectedValueOnce({
      response: undefined
    } as AxiosError)

    const TestComponent = () => {
      const methods = useRegisterSpecialtyModel({
        createSpecialtyService: createService
      })
      return <RegisterSpecialtyView {...methods} />
    }

    renderView(<TestComponent />)

    const input = screen.getByPlaceholderText('Oftamologista')
    await userEvent.type(input, 'Dermatologia')

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        'Erro ao criar Especialidade.',
        { variant: 'error' }
      )
    })
  })

  it('should reset specialty name when clicking Cancelar', async () => {
    renderView(<MakeSut />)

    const input = screen.getByPlaceholderText(
      'Oftamologista'
    ) as HTMLInputElement

    await userEvent.type(input, 'Pediatria')
    expect(input).toHaveValue('Pediatria')

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(input).toHaveValue('')
  })
})
