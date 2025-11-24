import { jest } from '@jest/globals'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Cookies from 'js-cookie'
import { enqueueSnackbar } from 'notistack'
import { AxiosError } from 'axios'

import { renderView } from '@/test/mock/react-query/renderScreen'
import RegisterPatientView from './register-patient-view'
import { useRegisterPatientModel } from './register-patient-model'
import { InMemoryCreatePatientService } from '@/test/mock/patient-service/patient'

jest.mock('js-cookie', () => ({
  get: jest.fn()
}))

jest.mock('notistack', () => ({
  enqueueSnackbar: jest.fn()
}))

const fillValidForm = async () => {
  const nameInput = screen.getByLabelText('Nome')
  const cpfInput = screen.getByLabelText('CPF')
  const phoneInput = screen.getByLabelText('Telefone')

  await userEvent.type(nameInput, 'Pablo Rocha')
  await userEvent.type(cpfInput, '12345678901')
  await userEvent.type(phoneInput, '71998873114')
}

const MakeSut = () => {
  const methods = useRegisterPatientModel({
    createPatientService: new InMemoryCreatePatientService()
  })

  return <RegisterPatientView {...methods} />
}

describe('RegisterPatientView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(Cookies.get as jest.Mock).mockReturnValue('mock-token')
  })

  it('should render register patient form', () => {
    renderView(<MakeSut />)

    expect(screen.getByText('Cadastrar Paciente')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Pablo Rocha')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('000.000.00-00')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('(71)99887-3114')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })

  it('should update and mask patient fields', async () => {
    renderView(<MakeSut />)

    const nameInput = screen.getByLabelText('Nome') as HTMLInputElement
    const cpfInput = screen.getByLabelText('CPF') as HTMLInputElement
    const phoneInput = screen.getByLabelText('Telefone') as HTMLInputElement

    await userEvent.type(nameInput, 'Pablo Rocha')
    await userEvent.type(cpfInput, '12345678901')
    await userEvent.type(phoneInput, '71998873114')

    expect(nameInput).toHaveValue('Pablo Rocha')
    expect(cpfInput).toHaveValue('123.456.789-01')
    expect(phoneInput).toHaveValue('(71)99887-3114')
  })

  it('should submit form and call service with correct payload', async () => {
    const createPatientService = new InMemoryCreatePatientService()
    const execSpy = jest.spyOn(createPatientService, 'exec')

    const TestComponent = () => {
      const methods = useRegisterPatientModel({
        createPatientService
      })

      return <RegisterPatientView {...methods} />
    }

    renderView(<TestComponent />)

    await fillValidForm()

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(execSpy).toHaveBeenCalledWith({
        body: {
          name: 'Pablo Rocha',
          cpf: '123.456.789-01',
          phone: '(71)99887-3114'
        },
        token: 'mock-token'
      })
    })
  })

  it('should show success message after creating patient', async () => {
    renderView(<MakeSut />)

    await fillValidForm()

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        'Paciente criado com sucesso!',
        { variant: 'success' }
      )
    })
  })

  it('should show validation warning when fields are empty', async () => {
    renderView(<MakeSut />)

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('O nome é obrigatório.', {
        variant: 'warning'
      })
    })
  })

  it('should show validation warning when cpf is invalid', async () => {
    renderView(<MakeSut />)

    const nameInput = screen.getByLabelText('Nome')
    const cpfInput = screen.getByLabelText('CPF')
    const phoneInput = screen.getByLabelText('Telefone')

    await userEvent.type(nameInput, 'Pablo Rocha')
    await userEvent.type(cpfInput, '1234')
    await userEvent.type(phoneInput, '71998873114')

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('CPF inválido.', {
        variant: 'warning'
      })
    })
  })

  it('should show error message when service fails', async () => {
    const createPatientService = new InMemoryCreatePatientService()
    const errorMessage = 'Erro ao criar paciente'

    jest.spyOn(createPatientService, 'exec').mockRejectedValueOnce({
      response: {
        data: { message: errorMessage }
      }
    } as AxiosError)

    const TestComponent = () => {
      const methods = useRegisterPatientModel({
        createPatientService
      })

      return <RegisterPatientView {...methods} />
    }

    renderView(<TestComponent />)

    await fillValidForm()

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(errorMessage, {
        variant: 'error'
      })
    })
  })

  it('should show default error message when service fails without response', async () => {
    const createPatientService = new InMemoryCreatePatientService()

    jest.spyOn(createPatientService, 'exec').mockRejectedValueOnce({
      response: undefined
    } as AxiosError)

    const TestComponent = () => {
      const methods = useRegisterPatientModel({
        createPatientService
      })

      return <RegisterPatientView {...methods} />
    }

    renderView(<TestComponent />)

    await fillValidForm()

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('Erro ao criar Paciente.', {
        variant: 'error'
      })
    })
  })

  it('should reset fields when clicking Cancelar', async () => {
    renderView(<MakeSut />)

    await fillValidForm()

    expect(screen.getByLabelText('Nome')).toHaveValue('Pablo Rocha')

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    const nameInput = screen.getByLabelText('Nome')
    const cpfInput = screen.getByLabelText('CPF')
    const phoneInput = screen.getByLabelText('Telefone')

    expect(nameInput).toHaveValue('')
    expect(cpfInput).toHaveValue('')
    expect(phoneInput).toHaveValue('')
  })

  it('should reset fields after successful submission', async () => {
    renderView(<MakeSut />)

    await fillValidForm()

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Nome')).toHaveValue('')
      expect(screen.getByLabelText('CPF')).toHaveValue('')
      expect(screen.getByLabelText('Telefone')).toHaveValue('')
    })
  })
})
