import { MdOutlineEmail } from 'react-icons/md'
import { BsKey } from 'react-icons/bs'
import Input from '@/presentation/components/Inputs/AuthInput'
import Button from '@/presentation/components/Button'
import { FormEvent } from 'react'
import { LoginFormData } from '@/domain/validations/user-validation'

interface ILoginForm {
  handleCreateLogin?: (e: FormEvent) => void
  setEmail: (e: string) => void
  email: string
  setPassword: (e: string) => void
  password: string
  isLoading?: boolean
  fieldErrors: Partial<Record<keyof LoginFormData, string>>
  touched: Record<keyof LoginFormData, boolean>
  setTouched: React.Dispatch<
    React.SetStateAction<Record<keyof LoginFormData, boolean>>
  >
}

export default function LoginForm({
  handleCreateLogin,
  setEmail,
  email,
  setPassword,
  password,
  isLoading,
  fieldErrors,
  touched,
  setTouched
}: ILoginForm) {
  return (
    <form onSubmit={handleCreateLogin}>
      <Input
        IconLeft={MdOutlineEmail}
        type="email"
        placeholder="Insira seu email"
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
        value={email}
        error={touched?.email ? fieldErrors.email : undefined}
      />
      <Input
        IconLeft={BsKey}
        type="password"
        placeholder="Insira uma senha"
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
        value={password}
        error={touched?.password ? fieldErrors.password : undefined}
      />
      <Button
        type="submit"
        label="Entrar"
        disabled={email === '' || password === ''}
        isLoading={isLoading}
      />
    </form>
  )
}
