import { jest } from '@jest/globals'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Cookies from 'js-cookie'
import { enqueueSnackbar } from 'notistack'
import { AxiosError } from 'axios'

import { renderView } from '@/test/mock/react-query/renderScreen'
import AppointmentsView from './appointments-view'
import { useAppointmentsModel } from './appointments-model'
import {
  InMemoryGetPatientByCPFService,
  InMemoryGetSpecialtiesService,
  InMemoryGetAvailableDaysService,
  InMemoryCreateAppointmentService,
  InMemoryGetDoctorByIDService
} from '@/test/mock/appointments-service/appointments'

jest.mock('js-cookie', () => ({
  get: jest.fn()
}))

jest.mock('notistack', () => ({
  enqueueSnackbar: jest.fn()
}))

const MakeSut = () => {
  const methods = useAppointmentsModel({
    getPatientByCPFService: new InMemoryGetPatientByCPFService(),
    getSpecialtiesService: new InMemoryGetSpecialtiesService(),
    getAvailableDaysService: new InMemoryGetAvailableDaysService(),
    createAppointmentService: new InMemoryCreateAppointmentService(),
    getDoctorByCRMService: new InMemoryGetDoctorByIDService()
  })

  return <AppointmentsView {...methods} />
}

describe('AppointmentsView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(Cookies.get as jest.Mock).mockImplementation((key) => {
      if (key === 'token') return 'mock-token'
      if (key === 'userName') return 'Lucas Veloso'
      return undefined
    })
  })

  it('should render appointments form', async () => {
    renderView(<MakeSut />)

    await waitFor(() => {
      expect(screen.getByText(/Bem Vindo/i)).toBeInTheDocument()
      expect(
        screen.getByLabelText('Insira CPF do paciente')
      ).toBeInTheDocument()
      expect(screen.getByLabelText('Nome do paciente')).toBeInTheDocument()
      expect(screen.getByLabelText('Especialidade')).toBeInTheDocument()
    })
  })

  it('should fetch patient when CPF is entered and Enter is pressed', async () => {
    const getPatientService = new InMemoryGetPatientByCPFService()
    const execSpy = jest.spyOn(getPatientService, 'exec')

    const TestComponent = () => {
      const methods = useAppointmentsModel({
        getPatientByCPFService: getPatientService,
        getSpecialtiesService: new InMemoryGetSpecialtiesService(),
        getAvailableDaysService: new InMemoryGetAvailableDaysService(),
        createAppointmentService: new InMemoryCreateAppointmentService(),
        getDoctorByCRMService: new InMemoryGetDoctorByIDService()
      })

      return <AppointmentsView {...methods} />
    }

    renderView(<TestComponent />)

    const cpfInput = screen.getByLabelText('Insira CPF do paciente')

    await userEvent.type(cpfInput, '12345678900')
    await userEvent.keyboard('{Enter}')

    await waitFor(() => {
      expect(execSpy).toHaveBeenCalledWith({
        cpf: '12345678900',
        token: 'mock-token'
      })
    })
  })

  it('should display patient name when patient is fetched', async () => {
    renderView(<MakeSut />)

    const cpfInput = screen.getByLabelText('Insira CPF do paciente')

    await userEvent.type(cpfInput, '12345678900')
    await userEvent.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByDisplayValue('John Patient')).toBeInTheDocument()
    })
  })

  it('should fetch specialties on mount', async () => {
    const getSpecialtiesService = new InMemoryGetSpecialtiesService()
    const execSpy = jest.spyOn(getSpecialtiesService, 'exec')

    const TestComponent = () => {
      const methods = useAppointmentsModel({
        getPatientByCPFService: new InMemoryGetPatientByCPFService(),
        getSpecialtiesService: getSpecialtiesService,
        getAvailableDaysService: new InMemoryGetAvailableDaysService(),
        createAppointmentService: new InMemoryCreateAppointmentService(),
        getDoctorByCRMService: new InMemoryGetDoctorByIDService()
      })

      return <AppointmentsView {...methods} />
    }

    renderView(<TestComponent />)

    await waitFor(() => {
      expect(execSpy).toHaveBeenCalledWith({ token: 'mock-token' })
    })
  })

  it('should fetch available days when specialty is selected', async () => {
    const getAvailableDaysService = new InMemoryGetAvailableDaysService()
    const execSpy = jest.spyOn(getAvailableDaysService, 'exec')

    const TestComponent = () => {
      const methods = useAppointmentsModel({
        getPatientByCPFService: new InMemoryGetPatientByCPFService(),
        getSpecialtiesService: new InMemoryGetSpecialtiesService(),
        getAvailableDaysService: getAvailableDaysService,
        createAppointmentService: new InMemoryCreateAppointmentService(),
        getDoctorByCRMService: new InMemoryGetDoctorByIDService()
      })

      return <AppointmentsView {...methods} />
    }

    renderView(<TestComponent />)

    await waitFor(() => {
      expect(screen.getByText('Especialidade')).toBeInTheDocument()
    })

    const specialtySelect = screen.getByText('Selecione...')
    await userEvent.click(specialtySelect)

    await waitFor(() => {
      const option = screen.getByText('Cardiologia')
      expect(option).toBeInTheDocument()
    })

    const cardiologiaOption = screen.getByText('Cardiologia')
    await userEvent.click(cardiologiaOption)

    await waitFor(() => {
      expect(execSpy).toHaveBeenCalledWith({
        token: 'mock-token',
        body: expect.objectContaining({
          specialties_id: 'specialty-id-1',
          date: expect.any(Date)
        })
      })
    })
  })

  it('should display doctor name when available days are fetched', async () => {
    const getDoctorService = new InMemoryGetDoctorByIDService()
    const execSpy = jest.spyOn(getDoctorService, 'exec')

    const TestComponent = () => {
      const methods = useAppointmentsModel({
        getPatientByCPFService: new InMemoryGetPatientByCPFService(),
        getSpecialtiesService: new InMemoryGetSpecialtiesService(),
        getAvailableDaysService: new InMemoryGetAvailableDaysService(),
        createAppointmentService: new InMemoryCreateAppointmentService(),
        getDoctorByCRMService: getDoctorService
      })

      return <AppointmentsView {...methods} />
    }

    renderView(<TestComponent />)

    await waitFor(() => {
      expect(screen.getByText('Especialidade')).toBeInTheDocument()
    })

    const specialtySelect = screen.getByText('Selecione...')
    await userEvent.click(specialtySelect)

    await waitFor(() => {
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText('Cardiologia'))

    await waitFor(() => {
      expect(execSpy).toHaveBeenCalledWith({
        id: 'doctor-id-1',
        token: 'mock-token'
      })
    })

    await waitFor(() => {
      expect(screen.getByDisplayValue('Dr. John Doe')).toBeInTheDocument()
    })
  })

  it('should show error message when patient fetch fails', async () => {
    const getPatientService = new InMemoryGetPatientByCPFService()
    jest.spyOn(getPatientService, 'exec').mockRejectedValueOnce({
      response: {
        data: { message: 'Patient not found' }
      }
    } as AxiosError)

    const TestComponent = () => {
      const methods = useAppointmentsModel({
        getPatientByCPFService: getPatientService,
        getSpecialtiesService: new InMemoryGetSpecialtiesService(),
        getAvailableDaysService: new InMemoryGetAvailableDaysService(),
        createAppointmentService: new InMemoryCreateAppointmentService(),
        getDoctorByCRMService: new InMemoryGetDoctorByIDService()
      })

      return <AppointmentsView {...methods} />
    }

    renderView(<TestComponent />)

    const cpfInput = screen.getByLabelText('Insira CPF do paciente')
    await userEvent.type(cpfInput, '12345678900')
    await userEvent.keyboard('{Enter}')

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('Erro ao buscar Paciente.', {
        variant: 'error'
      })
    })
  })

  it('should show error when trying to create appointment without doctor data', async () => {
    const createAppointmentService = new InMemoryCreateAppointmentService()
    const getPatientService = new InMemoryGetPatientByCPFService()

    const TestComponent = () => {
      const methods = useAppointmentsModel({
        getPatientByCPFService: getPatientService,
        getSpecialtiesService: new InMemoryGetSpecialtiesService(),
        getAvailableDaysService: new InMemoryGetAvailableDaysService(),
        createAppointmentService: createAppointmentService,
        getDoctorByCRMService: new InMemoryGetDoctorByIDService()
      })

      return <AppointmentsView {...methods} />
    }

    renderView(<TestComponent />)

    const cpfInput = screen.getByLabelText('Insira CPF do paciente')
    await userEvent.type(cpfInput, '12345678900')
    await userEvent.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByDisplayValue('John Patient')).toBeInTheDocument()
    })

    const submitButton = screen.getByText('Agendar')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        'Dados do médico não encontrados.',
        { variant: 'error' }
      )
    })
  })
  it('should show warning when trying to create appointment without patient', async () => {
    renderView(<MakeSut />)

    await waitFor(() => {
      const submitButton = screen.getByText('Agendar')
      expect(submitButton).toBeInTheDocument()
    })

    const submitButton = screen.getByText('Agendar')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        'Dados do paciente não encontrados.',
        { variant: 'error' }
      )
    })
  })

  it('should show success message after creating appointment', async () => {
    const createAppointmentService = new InMemoryCreateAppointmentService()
    const getPatientService = new InMemoryGetPatientByCPFService()

    const TestComponent = () => {
      const methods = useAppointmentsModel({
        getPatientByCPFService: getPatientService,
        getSpecialtiesService: new InMemoryGetSpecialtiesService(),
        getAvailableDaysService: new InMemoryGetAvailableDaysService(),
        createAppointmentService: createAppointmentService,
        getDoctorByCRMService: new InMemoryGetDoctorByIDService()
      })

      return <AppointmentsView {...methods} />
    }

    renderView(<TestComponent />)

    const cpfInput = screen.getByLabelText('Insira CPF do paciente')
    await userEvent.type(cpfInput, '12345678900')
    await userEvent.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByDisplayValue('John Patient')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('Selecione...')).toBeInTheDocument()
    })

    const specialtySelect = screen.getByText('Selecione...')
    await userEvent.click(specialtySelect)

    await waitFor(() => {
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText('Cardiologia'))
  })

  it('should show error message when appointment creation fails', async () => {
    const createAppointmentService = new InMemoryCreateAppointmentService()
    const errorMessage = 'Erro ao criar consulta'

    jest.spyOn(createAppointmentService, 'exec').mockRejectedValueOnce({
      response: {
        data: { message: errorMessage }
      }
    } as AxiosError)

    const getPatientService = new InMemoryGetPatientByCPFService()

    const TestComponent = () => {
      const methods = useAppointmentsModel({
        getPatientByCPFService: getPatientService,
        getSpecialtiesService: new InMemoryGetSpecialtiesService(),
        getAvailableDaysService: new InMemoryGetAvailableDaysService(),
        createAppointmentService: createAppointmentService,
        getDoctorByCRMService: new InMemoryGetDoctorByIDService()
      })

      return <AppointmentsView {...methods} />
    }

    renderView(<TestComponent />)

    const cpfInput = screen.getByLabelText('Insira CPF do paciente')
    await userEvent.type(cpfInput, '12345678900')
    await userEvent.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByDisplayValue('John Patient')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('Selecione...')).toBeInTheDocument()
    })

    const specialtySelect = screen.getByText('Selecione...')
    await userEvent.click(specialtySelect)

    await waitFor(() => {
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText('Cardiologia'))
  })

  it('should reset form when Cancelar is clicked', async () => {
    renderView(<MakeSut />)

    const cpfInput = screen.getByLabelText('Insira CPF do paciente')
    await userEvent.type(cpfInput, '12345678900')
    await userEvent.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByDisplayValue('John Patient')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Cancelar'))

    await waitFor(() => {
      expect(cpfInput).toHaveValue('')
    })
  })

  it('should display user name from cookies', async () => {
    renderView(<MakeSut />)

    await waitFor(() => {
      expect(screen.getByText(/Lucas/i)).toBeInTheDocument()
    })
  })
})
