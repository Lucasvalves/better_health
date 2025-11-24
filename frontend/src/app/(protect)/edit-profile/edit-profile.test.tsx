import { jest } from '@jest/globals'
import { mockRouter } from '@/test/mock/next-router'

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter
}))

jest.mock('js-cookie', () => ({
  get: jest.fn()
}))

jest.mock('notistack', () => ({
  enqueueSnackbar: jest.fn()
}))

beforeAll(() => {
  globalThis.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
})

import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Cookies from 'js-cookie'
import { enqueueSnackbar } from 'notistack'
import { AxiosError } from 'axios'
import { renderView } from '@/test/mock/react-query/renderScreen'
import EditProfileView from './edit-profile-view'
import {
  InMemoryGetUserService,
  InMemoryUpdateUserService
} from '@/test/mock/user-service/user'
import useEditProfileModel from './edit-profile-model'

const mockUser = {
  name: 'User Test',
  password: '123456789',
  email: 'user@test.com',
  avatar_url: '/mock-avatar-url.jpg'
}

const MakeSut = () => {
  const methods = useEditProfileModel({
    updateUserService: new InMemoryUpdateUserService(),
    getUserService: new InMemoryGetUserService()
  })

  return <EditProfileView {...methods} />
}

describe('EditProfileView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(Cookies.get as jest.Mock).mockReturnValue('mock-token')
  })

  it('should render initial user data', async () => {
    renderView(<MakeSut />)

    expect(await screen.findByText('Editar Perfil')).toBeInTheDocument()

    const oldPass = screen.getByLabelText('Senha antiga')
    const newPass = screen.getByLabelText('Nova senha')

    expect(oldPass).toHaveValue('')
    expect(newPass).toHaveValue('')

    await waitFor(() => {
      const avatar = screen.getByAltText('Avatar') as HTMLImageElement
      expect(avatar.src).toContain(mockUser.avatar_url)
    })
  })

  it('should update password fields', async () => {
    renderView(<MakeSut />)

    const oldPass = screen.getByLabelText('Senha antiga')
    const newPass = screen.getByLabelText('Nova senha')

    await userEvent.type(oldPass, '123456')
    await userEvent.type(newPass, '987654')

    expect(oldPass).toHaveValue('123456')
    expect(newPass).toHaveValue('987654')
  })

  it('should submit form and call updateUser service with correct payload', async () => {
    const updateService = new InMemoryUpdateUserService()
    const getService = new InMemoryGetUserService()
    const execSpy = jest.spyOn(updateService, 'exec')

    const TestComponent = () => {
      const methods = useEditProfileModel({
        updateUserService: updateService,
        getUserService: getService
      })
      return <EditProfileView {...methods} />
    }

    renderView(<TestComponent />)

    const oldPass = screen.getByLabelText('Senha antiga')
    const newPass = screen.getByLabelText('Nova senha')

    await userEvent.type(oldPass, '111111')
    await userEvent.type(newPass, '222222')

    fireEvent.submit(screen.getByTestId('edit-profile-form'))

    await waitFor(() => {
      expect(execSpy).toHaveBeenCalledWith({
        body: expect.objectContaining({
          oldPassword: '111111',
          newPassword: '222222'
        }),
        token: 'mock-token'
      })
    })
  })

  it('should show success message after successful update', async () => {
    const updateService = new InMemoryUpdateUserService()
    const getService = new InMemoryGetUserService()

    const TestComponent = () => {
      const methods = useEditProfileModel({
        updateUserService: updateService,
        getUserService: getService
      })
      return <EditProfileView {...methods} />
    }

    renderView(<TestComponent />)

    const oldPass = screen.getByLabelText('Senha antiga')
    const newPass = screen.getByLabelText('Nova senha')

    await userEvent.type(oldPass, '111111')
    await userEvent.type(newPass, '222222')

    fireEvent.submit(screen.getByTestId('edit-profile-form'))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        'Usuário atualizado com sucesso!',
        { variant: 'success' }
      )
    })
  })

  it('should show error message when update fails', async () => {
    const updateService = new InMemoryUpdateUserService()
    const getService = new InMemoryGetUserService()
    const errorMessage = 'Erro ao atualizar usuário'

    jest.spyOn(updateService, 'exec').mockRejectedValueOnce({
      response: {
        data: { message: 'Erro ao atualizar usuário' }
      }
    } as AxiosError)

    const TestComponent = () => {
      const methods = useEditProfileModel({
        updateUserService: updateService,
        getUserService: getService
      })
      return <EditProfileView {...methods} />
    }

    renderView(<TestComponent />)

    const oldPass = screen.getByLabelText('Senha antiga')
    const newPass = screen.getByLabelText('Nova senha')

    await userEvent.type(oldPass, '111111')
    await userEvent.type(newPass, '222222')

    fireEvent.submit(screen.getByTestId('edit-profile-form'))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(errorMessage, {
        variant: 'error'
      })
    })
  })

  it('should show default error message when update fails without response', async () => {
    const updateService = new InMemoryUpdateUserService()
    const getService = new InMemoryGetUserService()
    jest.spyOn(updateService, 'exec').mockRejectedValueOnce({
      response: undefined
    } as AxiosError)

    const TestComponent = () => {
      const methods = useEditProfileModel({
        updateUserService: updateService,
        getUserService: getService
      })
      return <EditProfileView {...methods} />
    }

    renderView(<TestComponent />)

    const oldPass = screen.getByLabelText('Senha antiga')
    const newPass = screen.getByLabelText('Nova senha')

    await userEvent.type(oldPass, '111111')
    await userEvent.type(newPass, '222222')

    fireEvent.submit(screen.getByTestId('edit-profile-form'))

    await waitFor(() => {
      expect(enqueueSnackbar).toHaveBeenCalledWith(
        'Erro ao atualizar usuário.',
        { variant: 'error' }
      )
    })
  })

  it("should reset fields when clicking 'Cancelar'", async () => {
    renderView(<MakeSut />)

    const oldPass = screen.getByLabelText('Senha antiga')
    const newPass = screen.getByLabelText('Nova senha')

    await userEvent.type(oldPass, 'abc123')
    await userEvent.type(newPass, 'xyz987')

    expect(oldPass).toHaveValue('abc123')
    expect(newPass).toHaveValue('xyz987')

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' })
    fireEvent.click(cancelButton)

    await waitFor(() => {
      expect(oldPass).toHaveValue('')
      expect(newPass).toHaveValue('')
    })
  })

  it('should reset avatar to original when clicking Cancelar after selecting file', async () => {
    renderView(<MakeSut />)

    const fileInput = screen.getByTitle('Selecionar imagem de perfil')
    const file = new File(['test'], 'avatar.png', { type: 'image/png' })

    await userEvent.upload(fileInput, file)

    await waitFor(() => {
      const avatar = screen.getByAltText('Avatar') as HTMLImageElement
      expect(avatar.src).toContain('blob:')
    })

    const cancelButton = screen.getByRole('button', { name: 'Cancelar' })
    fireEvent.click(cancelButton)

    await waitFor(() => {
      const avatar = screen.getByAltText('Avatar') as HTMLImageElement
      expect(avatar.src).toContain(mockUser.avatar_url)
    })
  })

  it('should trigger file input when clicking avatar image', async () => {
    renderView(<MakeSut />)

    const avatar = screen.getByAltText('Avatar')
    const fileInput = screen.getByTitle('Selecionar imagem de perfil')

    const spy = jest.spyOn(fileInput, 'click')

    fireEvent.click(avatar)

    expect(spy).toHaveBeenCalled()
  })

  it('should update avatar preview when selecting a file', async () => {
    renderView(<MakeSut />)

    const fileInput = screen.getByTitle('Selecionar imagem de perfil')

    const file = new File(['test'], 'avatar.png', { type: 'image/png' })

    await userEvent.upload(fileInput, file)

    await waitFor(() => {
      const avatar = screen.getByAltText('Avatar') as HTMLImageElement
      expect(avatar.src).toContain('blob:')
    })
  })

  it('should submit form with avatar file when file is selected', async () => {
    const updateService = new InMemoryUpdateUserService()
    const getService = new InMemoryGetUserService()
    const execSpy = jest.spyOn(updateService, 'exec')

    const TestComponent = () => {
      const methods = useEditProfileModel({
        updateUserService: updateService,
        getUserService: getService
      })
      return <EditProfileView {...methods} />
    }

    renderView(<TestComponent />)

    const fileInput = screen.getByTitle('Selecionar imagem de perfil')
    const file = new File(['test'], 'avatar.png', { type: 'image/png' })

    await userEvent.upload(fileInput, file)

    await waitFor(() => {
      const avatar = screen.getByAltText('Avatar') as HTMLImageElement
      expect(avatar.src).toContain('blob:')
    })

    const oldPass = screen.getByLabelText('Senha antiga')
    const newPass = screen.getByLabelText('Nova senha')

    await userEvent.type(oldPass, '111111')
    await userEvent.type(newPass, '222222')

    fireEvent.submit(screen.getByTestId('edit-profile-form'))

    await waitFor(() => {
      expect(execSpy).toHaveBeenCalledWith({
        body: expect.objectContaining({
          oldPassword: '111111',
          newPassword: '222222',
          avatar_url: file
        }),
        token: 'mock-token'
      })
    })
  })

  it('should call updateUser service with undefined token when no token is available', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue(undefined)

    const updateService = new InMemoryUpdateUserService()
    const getService = new InMemoryGetUserService()

    const execSpy = jest
      .spyOn(updateService, 'exec')
      .mockRejectedValueOnce(new Error('Token not found'))

    const TestComponent = () => {
      const methods = useEditProfileModel({
        updateUserService: updateService,
        getUserService: getService
      })
      return <EditProfileView {...methods} />
    }

    renderView(<TestComponent />)

    const oldPass = screen.getByLabelText('Senha antiga')
    const newPass = screen.getByLabelText('Nova senha')

    await userEvent.type(oldPass, '111111')
    await userEvent.type(newPass, '222222')

    fireEvent.submit(screen.getByTestId('edit-profile-form'))

    await waitFor(() => {
      expect(execSpy).toHaveBeenCalledWith({
        body: expect.objectContaining({
          oldPassword: '111111',
          newPassword: '222222'
        }),
        token: undefined
      })
    })
  })

  it('should load user data on mount', async () => {
    const updateService = new InMemoryUpdateUserService()
    const getService = new InMemoryGetUserService()

    const execSpy = jest.spyOn(getService, 'exec')

    const TestComponent = () => {
      const methods = useEditProfileModel({
        updateUserService: updateService,
        getUserService: getService
      })
      return <EditProfileView {...methods} />
    }

    renderView(<TestComponent />)

    await waitFor(() => {
      expect(execSpy).toHaveBeenCalledWith({ token: 'mock-token' })
    })
  })
})
