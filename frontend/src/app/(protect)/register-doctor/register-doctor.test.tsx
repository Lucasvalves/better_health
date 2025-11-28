import { jest } from '@jest/globals'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Cookies from 'js-cookie'
import { enqueueSnackbar } from 'notistack'
import { AxiosError } from 'axios'

import { renderView } from '@/test/mock/react-query/renderScreen'
import RegisterDoctorView from './register-doctor-view'
import { useRegisterDoctorModel } from './register-doctor-model'
import { InMemoryCreateDoctorService } from '@/test/mock/doctor-service/doctor'
import { InMemoryGetSpecialtiesService } from '@/test/mock/appointments-service/appointments'

jest.mock('js-cookie', () => ({
  get: jest.fn()
}))

jest.mock('notistack', () => ({
  enqueueSnackbar: jest.fn()
}))

const fillValidForm = async () => {
  const nameInput = screen.getByLabelText('Nome')
  const crmInput = screen.getByLabelText('CRM')

  await userEvent.type(nameInput, 'Dr. Amanda Teixeira')
  await userEvent.type(crmInput, '1234')
}

const MakeSut = () => {
  const methods = useRegisterDoctorModel({
    createDoctorService: new InMemoryCreateDoctorService(),
    getSpecialtiesService: new InMemoryGetSpecialtiesService()
  })

  return <RegisterDoctorView {...methods} />
}

describe('RegisterDoctorView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(Cookies.get as jest.Mock).mockReturnValue('mock-token')
  })

  it('should render register doctor form', async () => {
    renderView(<MakeSut />)

    await waitFor(() => {
      expect(screen.getByText('Cadastrar Médico')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Amanda Teixeira')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('1234')).toBeInTheDocument()
      expect(screen.getByLabelText('Especialidade')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Cancelar' })
      ).toBeInTheDocument()
    })
  })

  it('should update and mask doctor fields', async () => {
    renderView(<MakeSut />)

    await waitFor(() => {
      expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    })

    const nameInput = screen.getByLabelText('Nome') as HTMLInputElement
    const crmInput = screen.getByLabelText('CRM') as HTMLInputElement

    await userEvent.type(nameInput, 'Dr. Amanda Teixeira')
    await userEvent.type(crmInput, '1234')

    expect(nameInput).toHaveValue('Dr. Amanda Teixeira')
    expect(crmInput).toHaveValue('1234')
  })

  it('should load specialties from service', async () => {
    const getSpecialtiesService = new InMemoryGetSpecialtiesService()
    const execSpy = jest.spyOn(getSpecialtiesService, 'exec')

    const TestComponent = () => {
      const methods = useRegisterDoctorModel({
        createDoctorService: new InMemoryCreateDoctorService(),
        getSpecialtiesService
      })

      return <RegisterDoctorView {...methods} />
    }

    renderView(<TestComponent />)

    await waitFor(() => {
      expect(execSpy).toHaveBeenCalledWith({
        token: 'mock-token'
      })
    })
  })

  it('should submit form and call service with correct payload', async () => {
    const createDoctorService = new InMemoryCreateDoctorService()
    const execSpy = jest.spyOn(createDoctorService, 'exec')

    const TestComponent = () => {
      const methods = useRegisterDoctorModel({
        createDoctorService,
        getSpecialtiesService: new InMemoryGetSpecialtiesService()
      })

      return <RegisterDoctorView {...methods} />
    }

    renderView(<TestComponent />)

    await waitFor(() => {
      expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    })

    await fillValidForm()

    await waitFor(() => {
      expect(screen.getByText('Selecione...')).toBeInTheDocument()
    })

    const specialtySelect = screen.getByText('Selecione...')
    await userEvent.click(specialtySelect)

    await waitFor(() => {
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText('Cardiologia'))

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(execSpy).toHaveBeenCalledWith({
        body: {
          name: 'Dr. Amanda Teixeira',
          crm: '1234',
          specialties_id: expect.any(String)
        },
        token: 'mock-token'
      })
    })
  })

  it('should show success message after creating doctor', async () => {
    renderView(<MakeSut />)

    await waitFor(() => {
      expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    })

    await fillValidForm()

    await waitFor(() => {
      expect(screen.getByText('Selecione...')).toBeInTheDocument()
    })

    const specialtySelect = screen.getByText('Selecione...')
    await userEvent.click(specialtySelect)

    await waitFor(() => {
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText('Cardiologia'))

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        'Médico criado com sucesso!',
        { variant: 'success' }
      )
    })
  })

  it('should show validation warning when name is empty', async () => {
    renderView(<MakeSut />)

    await waitFor(() => {
      expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('O nome é obrigatório.', {
        variant: 'warning'
      })
    })
  })

  it('should show validation warning when name is too short', async () => {
    renderView(<MakeSut />)

    await waitFor(() => {
      expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    })

    const nameInput = screen.getByLabelText('Nome')
    await userEvent.type(nameInput, 'Dr')

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('O nome está muito curto.', {
        variant: 'warning'
      })
    })
  })

  it('should show validation warning when CRM is empty', async () => {
    renderView(<MakeSut />)

    await waitFor(() => {
      expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    })

    const nameInput = screen.getByLabelText('Nome')
    await userEvent.type(nameInput, 'Dr. Amanda Teixeira')

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('O CRM é obrigatório.', {
        variant: 'warning'
      })
    })
  })

  it('should show validation warning when CRM is invalid', async () => {
    renderView(<MakeSut />)

    await waitFor(() => {
      expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    })

    const nameInput = screen.getByLabelText('Nome')
    const crmInput = screen.getByLabelText('CRM')

    await userEvent.type(nameInput, 'Dr. Amanda Teixeira')
    await userEvent.type(crmInput, '123')

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('CRM inválido.', {
        variant: 'warning'
      })
    })
  })

  it('should show validation warning when specialty is not selected', async () => {
    renderView(<MakeSut />)

    await waitFor(() => {
      expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    })

    await fillValidForm()

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        'Selecione uma especialidade.',
        { variant: 'warning' }
      )
    })
  })

  it('should show error message when service fails', async () => {
    const createDoctorService = new InMemoryCreateDoctorService()
    const errorMessage = 'Erro ao criar médico'

    jest.spyOn(createDoctorService, 'exec').mockRejectedValueOnce({
      response: {
        data: { message: errorMessage }
      }
    } as AxiosError)

    const TestComponent = () => {
      const methods = useRegisterDoctorModel({
        createDoctorService,
        getSpecialtiesService: new InMemoryGetSpecialtiesService()
      })

      return <RegisterDoctorView {...methods} />
    }

    renderView(<TestComponent />)

    await waitFor(() => {
      expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    })

    await fillValidForm()

    await waitFor(() => {
      expect(screen.getByText('Selecione...')).toBeInTheDocument()
    })

    const specialtySelect = screen.getByText('Selecione...')
    await userEvent.click(specialtySelect)

    await waitFor(() => {
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText('Cardiologia'))

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(errorMessage, {
        variant: 'error'
      })
    })
  })

  it('should show default error message when service fails without response', async () => {
    const createDoctorService = new InMemoryCreateDoctorService()

    jest.spyOn(createDoctorService, 'exec').mockRejectedValueOnce({
      response: undefined
    } as AxiosError)

    const TestComponent = () => {
      const methods = useRegisterDoctorModel({
        createDoctorService,
        getSpecialtiesService: new InMemoryGetSpecialtiesService()
      })

      return <RegisterDoctorView {...methods} />
    }

    renderView(<TestComponent />)

    await waitFor(() => {
      expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    })

    await fillValidForm()

    await waitFor(() => {
      expect(screen.getByText('Selecione...')).toBeInTheDocument()
    })

    const specialtySelect = screen.getByText('Selecione...')
    await userEvent.click(specialtySelect)

    await waitFor(() => {
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText('Cardiologia'))

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('Erro ao criar Médico.', {
        variant: 'error'
      })
    })
  })

  it('should reset fields when clicking Cancelar', async () => {
    renderView(<MakeSut />)

    await waitFor(() => {
      expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    })

    await fillValidForm()

    expect(screen.getByLabelText('Nome')).toHaveValue('Dr. Amanda Teixeira')

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    const nameInput = screen.getByLabelText('Nome')
    const crmInput = screen.getByLabelText('CRM')

    expect(nameInput).toHaveValue('')
    expect(crmInput).toHaveValue('')
  })

  it('should reset fields after successful submission', async () => {
    renderView(<MakeSut />)

    await waitFor(() => {
      expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    })

    await fillValidForm()

    await waitFor(() => {
      expect(screen.getByText('Selecione...')).toBeInTheDocument()
    })

    const specialtySelect = screen.getByText('Selecione...')
    await userEvent.click(specialtySelect)

    await waitFor(() => {
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText('Cardiologia'))

    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Nome')).toHaveValue('')
      expect(screen.getByLabelText('CRM')).toHaveValue('')
    })
  })
})
