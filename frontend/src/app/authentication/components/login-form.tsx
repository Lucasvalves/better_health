import { MdOutlineEmail } from 'react-icons/md'
import { BsKey } from 'react-icons/bs'
import Input from '@/presentation/components/Inputs/AuthInput'
import Button from '@/presentation/components/Button'
import { FormEvent } from 'react'

interface ILoginForm {
  handleCreateLogin?: (e: FormEvent) => void
  setEmail: (e: string) => void
  email: string
  setPassword: (e: string) => void
  password: string
  isLoading: boolean
}

export default function LoginForm({
  handleCreateLogin,
  setEmail,
  email,
  setPassword,
  password,
  isLoading
}: ILoginForm) {
  return (
    <form onSubmit={handleCreateLogin}>
      <Input
        IconLeft={MdOutlineEmail}
        type="email"
        placeholder="Insira seu email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <Input
        IconLeft={BsKey}
        type="password"
        placeholder="Insira uma senha"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
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
