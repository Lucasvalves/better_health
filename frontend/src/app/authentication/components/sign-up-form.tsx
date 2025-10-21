import Input from '@/presentation/components/Inputs/AuthInput'
import { BsKey } from 'react-icons/bs'
import { MdOutlineEmail } from 'react-icons/md'
import { FaRegUser } from 'react-icons/fa'
import Button from '@/presentation/components/Button'
import { FormEvent } from 'react'
import { SignUpFormData } from '@/domain/validations/user-validation'

interface SignUpFormProps {
  setName: (e: string) => void
  setEmail: (e: string) => void
  setPassword: (e: string) => void
  name: string
  email: string
  password: string
  isLoading?: boolean
  handleCreateUser?: (e: FormEvent) => void
  fieldErrors: Partial<Record<keyof SignUpFormData, string>>
  touched: Record<keyof SignUpFormData, boolean>
  setTouched: React.Dispatch<
    React.SetStateAction<Record<keyof SignUpFormData, boolean>>
  >
}

export default function SignUpForm({
  setName,
  setEmail,
  setPassword,
  name,
  email,
  password,
  isLoading,
  handleCreateUser,
  fieldErrors,
  setTouched,
  touched
}: SignUpFormProps) {

  return (
    <form onSubmit={handleCreateUser}>
      <Input
        IconLeft={FaRegUser}
        type="text"
        placeholder="Insira seu nome"
        onChange={(e) => setName(e.target.value)}
        onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
        value={name}
        error={touched?.name ? fieldErrors.name : undefined}
      />
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
        error={touched?.password ? fieldErrors.password : undefined}
        value={password}
      />
      <Button
        type="submit"
        label="Confirmar"
        disabled={!name || !email || !password}
        isLoading={isLoading}
      />
    </form>
  )
}
