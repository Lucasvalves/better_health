import { screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthenticationView } from './authentication-view'
import { useAuthenticationModel } from './authentication-model'
import {
  InMemoryAuthUserService,
  InMemoryCreateUserService
} from '@/test/mock/user-service/user'
import { renderView } from '@/test/mock/react-query/renderScreen'
import userEvent from '@testing-library/user-event'

export const MakeSut = () => {
  const methods = useAuthenticationModel({
    createUserService: new InMemoryCreateUserService(),
    authUserService: new InMemoryAuthUserService()
  })

  return <AuthenticationView {...methods} />
}

describe('AuthenticationView Component', () => {
  it('should toggle to sign up form when clicking "Criar conta"', () => {
    renderView(<MakeSut />)

    fireEvent.click(screen.getByText('Criar conta'))

    expect(screen.getByText('Insira seus dados!')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Insira seu nome')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Insira seu email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Insira uma senha')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Confirmar' })
    ).toBeInTheDocument()
  })

  it('should show validation errors on blur for empty fields', () => {
    renderView(<MakeSut />)

    fireEvent.click(screen.getByText('Criar conta'))

    const name = screen.getByPlaceholderText(
      'Insira seu nome'
    ) as HTMLInputElement
    const email = screen.getByPlaceholderText(
      'Insira seu email'
    ) as HTMLInputElement
    const password = screen.getByPlaceholderText(
      'Insira uma senha'
    ) as HTMLInputElement

    fireEvent.blur(name)
    fireEvent.blur(email)
    fireEvent.blur(password)

    expect(screen.getByText('Nome é obrigatório.')).toBeInTheDocument()
    expect(screen.getByText('E-mail é obrigatório.')).toBeInTheDocument()
    expect(
      screen.getByText('A senha deve ter ao menos 8 caracteres.')
    ).toBeInTheDocument()
  })

  it('should keep confirm button disabled when fields are empty or invalid', async () => {
    renderView(<MakeSut />)

    fireEvent.click(screen.getByText('Criar conta'))

    const confirmButton = screen.getByRole('button', {
      name: 'Confirmar'
    }) as HTMLButtonElement
    expect(confirmButton).toBeDisabled()

    const name = screen.getByPlaceholderText(
      'Insira seu nome'
    ) as HTMLInputElement
    const email = screen.getByPlaceholderText(
      'Insira seu email'
    ) as HTMLInputElement
    const password = screen.getByPlaceholderText(
      'Insira uma senha'
    ) as HTMLInputElement

    userEvent.type(name, 'John')
    userEvent.type(email, 'invalid-email')
    userEvent.type(password, 'short')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Confirmar' })).toBeDisabled()
    })
  })

  it('should enable confirm button when fields are valid', async () => {
    renderView(<MakeSut />)

    fireEvent.click(screen.getByText('Criar conta'))

    const name = screen.getByPlaceholderText(
      'Insira seu nome'
    ) as HTMLInputElement
    const email = screen.getByPlaceholderText(
      'Insira seu email'
    ) as HTMLInputElement
    const password = screen.getByPlaceholderText(
      'Insira uma senha'
    ) as HTMLInputElement

    userEvent.type(name, 'John Doe')
    userEvent.type(email, 'john.doe@example.com')
    userEvent.type(password, 'StrongP4ssword')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Confirmar' })).toBeDisabled()
    })
  })

  it('should return to login form when clicking "Login"', () => {
    renderView(<MakeSut />)

    fireEvent.click(screen.getByText('Criar conta'))
    fireEvent.click(screen.getByText('Login'))

    expect(screen.getByText('Olá! Seja Bem Vindo!')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Insira seu email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Insira uma senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })
})
