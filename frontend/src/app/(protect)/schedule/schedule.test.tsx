import { jest } from '@jest/globals'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Cookies from 'js-cookie'
import { enqueueSnackbar } from 'notistack'
import { AxiosError } from 'axios'

import { renderView } from '@/test/mock/react-query/renderScreen'
import ScheduleView from './schedule-view'
import { useScheduleModel } from './schedule-model'
import { InMemoryGetDoctorByCRMService } from '@/test/mock/doctor-service/doctor'
import { InMemoryCreateScheduleService } from '@/test/mock/schedule-service/schedule'

jest.mock('js-cookie', () => ({
  get: jest.fn()
}))

jest.mock('notistack', () => ({
  enqueueSnackbar: jest.fn()
}))

const MakeSut = () => {
  const methods = useScheduleModel({
    getDoctorByCRMService: new InMemoryGetDoctorByCRMService(),
    createScheduleService: new InMemoryCreateScheduleService()
  })

  return <ScheduleView {...methods} />
}

describe('ScheduleView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(Cookies.get as jest.Mock).mockReturnValue('mock-token')
  })

  it('should render schedule form', () => {
    renderView(<MakeSut />)

    expect(screen.getByText('Montar Agenda')).toBeInTheDocument()
    expect(screen.getByLabelText('Insira CRM do médico')).toBeInTheDocument()
    expect(
      screen.getByLabelText('Hora de inicio da agenda')
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Hora de fim da agenda')).toBeInTheDocument()
    expect(screen.getByText('Selecione a data')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Confirmar' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })

  it('should update CRM and hours fields', async () => {
    renderView(<MakeSut />)

    const crmInput = screen.getByLabelText(
      'Insira CRM do médico'
    ) as HTMLInputElement
    const startHourInput = screen.getByLabelText(
      'Hora de inicio da agenda'
    ) as HTMLInputElement
    const endHourInput = screen.getByLabelText(
      'Hora de fim da agenda'
    ) as HTMLInputElement

    await userEvent.type(crmInput, '25267')
    fireEvent.change(startHourInput, { target: { value: '08:00' } })
    fireEvent.change(endHourInput, { target: { value: '12:00' } })

    expect(crmInput).toHaveValue('25267')
    expect(startHourInput).toHaveValue('08:00')
    expect(endHourInput).toHaveValue('12:00')
  })

  it('should fetch doctor when pressing Enter on CRM input', async () => {
    const getDoctorService = new InMemoryGetDoctorByCRMService()
    const createScheduleService = new InMemoryCreateScheduleService()
    const execSpy = jest.spyOn(getDoctorService, 'exec')

    const TestComponent = () => {
      const methods = useScheduleModel({
        getDoctorByCRMService: getDoctorService,
        createScheduleService
      })

      return <ScheduleView {...methods} />
    }

    renderView(<TestComponent />)

    const crmInput = screen.getByLabelText(
      'Insira CRM do médico'
    ) as HTMLInputElement

    await userEvent.type(crmInput, '25267')
    fireEvent.keyDown(crmInput, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13
    })

    await waitFor(() => {
      expect(execSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          crm: '25267',
          token: 'mock-token'
        })
      )
    })
  })

  it('should submit form and call createSchedule service with correct payload', async () => {
    const getDoctorService = new InMemoryGetDoctorByCRMService()
    const createScheduleService = new InMemoryCreateScheduleService()
    const execSpy = jest.spyOn(createScheduleService, 'exec')

    const TestComponent = () => {
      const methods = useScheduleModel({
        getDoctorByCRMService: getDoctorService,
        createScheduleService
      })

      return <ScheduleView {...methods} />
    }

    renderView(<TestComponent />)

    const crmInput = screen.getByLabelText(
      'Insira CRM do médico'
    ) as HTMLInputElement
    const startHourInput = screen.getByLabelText(
      'Hora de inicio da agenda'
    ) as HTMLInputElement
    const endHourInput = screen.getByLabelText(
      'Hora de fim da agenda'
    ) as HTMLInputElement

    await userEvent.type(crmInput, '25267')
    fireEvent.keyDown(crmInput, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13
    })

    await waitFor(() => {
      expect(screen.getByLabelText('Nome do médico')).toHaveValue('Dr. Teste')
    })

    const today = new Date().getDate().toString()
    const dayButton = screen.getByText(today)
    fireEvent.click(dayButton)

    fireEvent.change(startHourInput, { target: { value: '08:00' } })
    fireEvent.change(endHourInput, { target: { value: '12:00' } })

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))

    await waitFor(() => {
      expect(execSpy).toHaveBeenCalledWith({
        body: expect.objectContaining({
          startHour: '08:00',
          endHour: '12:00',
          days: expect.any(Number),
          doctors_id: 'doctor-id',
          specialties_id: 'specialty-id'
        }),
        token: 'mock-token'
      })
    })
  })

  it('should show success message after creating schedule', async () => {
    renderView(<MakeSut />)

    const crmInput = screen.getByLabelText(
      'Insira CRM do médico'
    ) as HTMLInputElement
    const startHourInput = screen.getByLabelText(
      'Hora de inicio da agenda'
    ) as HTMLInputElement
    const endHourInput = screen.getByLabelText(
      'Hora de fim da agenda'
    ) as HTMLInputElement

    await userEvent.type(crmInput, '25267')
    fireEvent.keyDown(crmInput, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13
    })

    await waitFor(() => {
      expect(screen.getByLabelText('Nome do médico')).toHaveValue('Dr. Teste')
    })

    const today = new Date().getDate().toString()
    const dayButton = screen.getByText(today)
    fireEvent.click(dayButton)

    fireEvent.change(startHourInput, { target: { value: '08:00' } })
    fireEvent.change(endHourInput, { target: { value: '12:00' } })

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        'Horário criado com sucesso!',
        { variant: 'success' }
      )
    })
  })

  it('should show validation warning when CRM is invalid', async () => {
    renderView(<MakeSut />)

    const crmInput = screen.getByLabelText(
      'Insira CRM do médico'
    ) as HTMLInputElement

    await userEvent.type(crmInput, 'abc')

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith('CRM é obrigatório', {
        variant: 'error'
      })
    })
  })

  it('should show validation warning when required fields are empty', async () => {
    renderView(<MakeSut />)

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalled()
    })
  })
  it('should show error message when createSchedule service fails', async () => {
    const getDoctorService = new InMemoryGetDoctorByCRMService()
    const createScheduleService = new InMemoryCreateScheduleService()
    const errorMessage = 'Erro ao criar horário'

    jest.spyOn(createScheduleService, 'exec').mockRejectedValueOnce({
      response: {
        data: { message: errorMessage }
      }
    } as AxiosError)

    const TestComponent = () => {
      const methods = useScheduleModel({
        getDoctorByCRMService: getDoctorService,
        createScheduleService
      })

      return <ScheduleView {...methods} />
    }

    renderView(<TestComponent />)

    const crmInput = screen.getByLabelText(
      'Insira CRM do médico'
    ) as HTMLInputElement
    const startHourInput = screen.getByLabelText(
      'Hora de inicio da agenda'
    ) as HTMLInputElement
    const endHourInput = screen.getByLabelText(
      'Hora de fim da agenda'
    ) as HTMLInputElement

    await userEvent.type(crmInput, '25267')
    fireEvent.keyDown(crmInput, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13
    })

    await waitFor(() => {
      expect(screen.getByLabelText('Nome do médico')).toHaveValue('Dr. Teste')
    })

    const today = new Date().getDate().toString()
    const dayButton = screen.getByText(today)
    fireEvent.click(dayButton)

    fireEvent.change(startHourInput, { target: { value: '08:00' } })
    fireEvent.change(endHourInput, { target: { value: '12:00' } })

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(errorMessage, {
        variant: 'error'
      })
    })
  })

  it("should reset fields when clicking 'Cancelar'", async () => {
    renderView(<MakeSut />)

    const crmInput = screen.getByLabelText(
      'Insira CRM do médico'
    ) as HTMLInputElement
    const startHourInput = screen.getByLabelText(
      'Hora de inicio da agenda'
    ) as HTMLInputElement
    const endHourInput = screen.getByLabelText(
      'Hora de fim da agenda'
    ) as HTMLInputElement

    await userEvent.type(crmInput, '25267')
    fireEvent.change(startHourInput, { target: { value: '08:00' } })
    fireEvent.change(endHourInput, { target: { value: '12:00' } })

    expect(crmInput).toHaveValue('25267')
    expect(startHourInput).toHaveValue('08:00')
    expect(endHourInput).toHaveValue('12:00')

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' })
    fireEvent.click(cancelButton)

    await waitFor(() => {
      expect(crmInput).toHaveValue('')
      expect(startHourInput).toHaveValue('')
      expect(endHourInput).toHaveValue('')
    })
  })
})
