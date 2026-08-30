import { jest } from '@jest/globals'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Cookies from 'js-cookie'
import { enqueueSnackbar } from 'notistack'
import { AxiosError } from 'axios'

import { renderView } from '@/test/mock/react-query/renderScreen'
import SearchAppointmentsView from './search-appoiments-view'
import { useSearchAppointmentsModel } from './search-appoiments-model'
import { InMemoryGetPatientByCPFService } from '@/test/mock/appointments-service/appointments'
import { AppointmentsPatientResponse } from '@/domain/models/appointment'
import {
  GetAppointmentsPatientServiceContract,
  GetAppointmentsPatient
} from '@/data/appointments-service/get-appointments-patient/get-appointments-patient'
import {
  DeleteAppointmentServiceContract,
  DeleteAppointment
} from '@/data/appointments-service/delete-appointment/delete-appointment-service'
import {
  UpdateAppointmentServiceContract,
  UpdateAppointment
} from '@/data/appointments-service/update-appointment/update-appointment-service'

jest.mock('js-cookie', () => ({
  get: jest.fn()
}))

jest.mock('notistack', () => ({
  enqueueSnackbar: jest.fn()
}))

class InMemoryGetAppointmentsPatientService
  implements GetAppointmentsPatientServiceContract
{
  async exec({
    patient_id
  }: GetAppointmentsPatient): Promise<AppointmentsPatientResponse> {
    const appointment: AppointmentsPatientResponse = {
      id: 'appointment-id-1',
      date: new Date('2025-01-01T10:00:00Z'),
      patients_id: patient_id,
      specialties_id: 'specialty-id-1',
      doctors_id: 'doctor-id-1',
      Doctor: {
        id: 'doctor-id-1',
        name: 'Dr. John Doe',
        crm: 'CRM12345',
        specialties_id: 'specialty-id-1'
      },
      Specialties: {
        id: 'specialty-id-1',
        name: 'Cardiologia'
      },
      Patients: {
        id: 'patient-id',
        name: 'John Patient',
        cpf: '12345678900',
        phone: '(11) 99999-9999'
      }
    }

    // @ts-expect-error: runtime returns an array of appointments
    return [appointment]
  }
}

class InMemoryDeleteAppointmentService
  implements DeleteAppointmentServiceContract
{
  async exec({ id }: DeleteAppointment): Promise<AppointmentsPatientResponse> {
    const appointment: AppointmentsPatientResponse = {
      id,
      date: new Date('2025-01-01T10:00:00Z'),
      patients_id: 'patient-id',
      specialties_id: 'specialty-id-1',
      doctors_id: 'doctor-id-1'
    }

    // @ts-expect-error: runtime may return an updated list
    return [appointment]
  }
}

class InMemoryUpdateAppointmentService
  implements UpdateAppointmentServiceContract
{
  async exec({
    id,
    newDate
  }: UpdateAppointment): Promise<AppointmentsPatientResponse> {
    const appointment: AppointmentsPatientResponse = {
      id,
      date: new Date(newDate),
      patients_id: 'patient-id',
      specialties_id: 'specialty-id-1',
      doctors_id: 'doctor-id-1'
    }

    // @ts-expect-error: runtime may return an updated list
    return [appointment]
  }
}

const MakeSut = () => {
  const methods = useSearchAppointmentsModel({
    getPatientByCPFService: new InMemoryGetPatientByCPFService(),
    getAppointmentsPatientService: new InMemoryGetAppointmentsPatientService(),
    deleteAppointmentService: new InMemoryDeleteAppointmentService(),
    updateAppointmentService: new InMemoryUpdateAppointmentService()
  })

  return <SearchAppointmentsView {...methods} />
}

describe('SearchAppointmentsView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(Cookies.get as jest.Mock).mockImplementation((key: string) => {
      if (key === 'token') return 'mock-token'
      if (key === 'userName') return 'Lucas Veloso'
      return undefined
    })
  })

  it('should render search appointments page', async () => {
    renderView(<MakeSut />)

    await waitFor(() => {
      expect(screen.getByText(/Busque um agendamento!/i)).toBeInTheDocument()
      expect(
        screen.getByLabelText('Insira CPF do paciente')
      ).toBeInTheDocument()
      expect(screen.getByLabelText('Nome  do paciente')).toBeInTheDocument()
      expect(screen.getByText('Data')).toBeInTheDocument()
      expect(screen.getByText('Especialidade')).toBeInTheDocument()
      expect(screen.getByText('Médico')).toBeInTheDocument()
      expect(screen.getByText('CRM')).toBeInTheDocument()
    })
  })

  it('should display user name from cookies', async () => {
    renderView(<MakeSut />)

    await waitFor(() => {
      expect(screen.getByText(/Lucas Veloso/i)).toBeInTheDocument()
    })
  })

  it('should fetch patient when CPF is entered and Enter is pressed', async () => {
    const getPatientService = new InMemoryGetPatientByCPFService()
    const execSpy = jest.spyOn(getPatientService, 'exec')

    const TestComponent = () => {
      const methods = useSearchAppointmentsModel({
        getPatientByCPFService: getPatientService,
        getAppointmentsPatientService:
          new InMemoryGetAppointmentsPatientService(),
        deleteAppointmentService: new InMemoryDeleteAppointmentService(),
        updateAppointmentService: new InMemoryUpdateAppointmentService()
      })

      return <SearchAppointmentsView {...methods} />
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

  it('should fetch appointments when patient is available', async () => {
    const appointmentsService = new InMemoryGetAppointmentsPatientService()
    const execSpy = jest.spyOn(appointmentsService, 'exec')

    const TestComponent = () => {
      const methods = useSearchAppointmentsModel({
        getPatientByCPFService: new InMemoryGetPatientByCPFService(),
        getAppointmentsPatientService: appointmentsService,
        deleteAppointmentService: new InMemoryDeleteAppointmentService(),
        updateAppointmentService: new InMemoryUpdateAppointmentService()
      })

      return <SearchAppointmentsView {...methods} />
    }

    renderView(<TestComponent />)

    const cpfInput = screen.getByLabelText('Insira CPF do paciente')
    await userEvent.type(cpfInput, '12345678900')
    await userEvent.keyboard('{Enter}')

    await waitFor(() => {
      expect(execSpy).toHaveBeenCalledWith({
        patient_id: 'patient-id',
        token: 'mock-token'
      })
    })
  })

  it('should reset search fields when clicking reset button', async () => {
    renderView(<MakeSut />)

    const cpfInput = screen.getByLabelText('Insira CPF do paciente')

    await userEvent.type(cpfInput, '12345678900')
    await userEvent.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByDisplayValue('John Patient')).toBeInTheDocument()
    })

    const resetButton = screen.getByTitle('Resetar busca')
    fireEvent.click(resetButton)

    await waitFor(() => {
      expect(cpfInput).toHaveValue('')
    })
  })

  it('should open delete modal and call delete service on confirm', async () => {
    const deleteService = new InMemoryDeleteAppointmentService()
    const execSpy = jest.spyOn(deleteService, 'exec')

    const TestComponent = () => {
      const methods = useSearchAppointmentsModel({
        getPatientByCPFService: new InMemoryGetPatientByCPFService(),
        getAppointmentsPatientService:
          new InMemoryGetAppointmentsPatientService(),
        deleteAppointmentService: deleteService,
        updateAppointmentService: new InMemoryUpdateAppointmentService()
      })

      return <SearchAppointmentsView {...methods} />
    }

    renderView(<TestComponent />)

    const cpfInput = screen.getByLabelText('Insira CPF do paciente')
    await userEvent.type(cpfInput, '12345678900')
    await userEvent.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
    })

    const deleteButton = screen.getByTitle('Excluir')
    await userEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.getByText('Excluir Agendamento')).toBeInTheDocument()
    })

    const confirmButton = screen.getByRole('button', { name: 'Excluir' })
    await userEvent.click(confirmButton)

    await waitFor(() => {
      expect(execSpy).toHaveBeenCalledWith({
        id: 'appointment-id-1',
        token: 'mock-token'
      })
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        'Consulta deletada com sucesso.',
        { variant: 'success' }
      )
    })
  })

  it('should open edit modal and call update service on confirm', async () => {
    const updateService = new InMemoryUpdateAppointmentService()
    const execSpy = jest.spyOn(updateService, 'exec')

    const TestComponent = () => {
      const methods = useSearchAppointmentsModel({
        getPatientByCPFService: new InMemoryGetPatientByCPFService(),
        getAppointmentsPatientService:
          new InMemoryGetAppointmentsPatientService(),
        deleteAppointmentService: new InMemoryDeleteAppointmentService(),
        updateAppointmentService: updateService
      })

      return <SearchAppointmentsView {...methods} />
    }

    renderView(<TestComponent />)

    const cpfInput = screen.getByLabelText('Insira CPF do paciente')
    await userEvent.type(cpfInput, '12345678900')
    await userEvent.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
    })

    const editButton = screen.getByTitle('Editar')
    await userEvent.click(editButton)

    await waitFor(() => {
      expect(screen.getByText('Editar Horário')).toBeInTheDocument()
    })

    const dateInput = screen.getByTitle("Data'")
    const timeInput = screen.getByTitle("Hora'")

    await userEvent.type(dateInput, '2025-01-02')
    await userEvent.type(timeInput, '12:30')

    const confirmButton = screen.getByRole('button', { name: 'Editar' })
    await userEvent.click(confirmButton)

    await waitFor(() => {
      expect(execSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          token: 'mock-token'
        })
      )
      expect(enqueueSnackbar).toHaveBeenCalledWith('Agendamento atualizado!', {
        variant: 'success'
      })
    })
  })

  it('should show error message when delete service fails', async () => {
    const deleteService = new InMemoryDeleteAppointmentService()
    const errorMessage = 'Erro ao deletar consulta'

    jest.spyOn(deleteService, 'exec').mockRejectedValueOnce({
      response: {
        data: { message: errorMessage }
      }
    } as AxiosError)

    const TestComponent = () => {
      const methods = useSearchAppointmentsModel({
        getPatientByCPFService: new InMemoryGetPatientByCPFService(),
        getAppointmentsPatientService:
          new InMemoryGetAppointmentsPatientService(),
        deleteAppointmentService: deleteService,
        updateAppointmentService: new InMemoryUpdateAppointmentService()
      })

      return <SearchAppointmentsView {...methods} />
    }

    renderView(<TestComponent />)

    const cpfInput = screen.getByLabelText('Insira CPF do paciente')
    await userEvent.type(cpfInput, '12345678900')
    await userEvent.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByText('Cardiologia')).toBeInTheDocument()
    })

    const deleteButton = screen.getByTitle('Excluir')
    await userEvent.click(deleteButton)

    const confirmButton = screen.getByRole('button', { name: 'Excluir' })
    await userEvent.click(confirmButton)

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(errorMessage, {
        variant: 'error'
      })
    })
  })
})
