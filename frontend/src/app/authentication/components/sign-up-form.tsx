import Input from '@/presentation/components/Inputs/AuthInput'
import { BsKey } from 'react-icons/bs'
import { MdOutlineEmail } from 'react-icons/md'
import { FaRegUser } from 'react-icons/fa'
import Button from '@/presentation/components/Button'
import { useMemo, useState } from 'react'
import { z } from 'zod'

interface ILoginForm {
  setName: (e: string) => void
  setEmail: (e: string) => void
  setPassword: (e: string) => void
  name: string
  email: string
  password: string
  isLoading?: boolean
}

const signUpSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório.').trim(),
  email: z.string().min(1, 'E-mail é obrigatório.').email('Informe um e-mail válido.'),
  password: z
    .string()
    .min(8, 'A senha deve ter ao menos 8 caracteres.')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula.')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula.')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número.')
})

type SignUpFormData = z.infer<typeof signUpSchema>

export default function SignUpForm({
  setName,
  setEmail,
  setPassword,
  name,
  email,
  password,
  isLoading
}: ILoginForm) {
  const [touched, setTouched] = useState<Record<keyof SignUpFormData, boolean>>({
    name: false,
    email: false,
    password: false
  })

  const parsed = useMemo(() => {
    const result = signUpSchema.safeParse({ name, email, password })
    if (!result.success) return result.error.flatten().fieldErrors
    return {}
  }, [name, email, password])

  const errors: Partial<Record<keyof SignUpFormData, string>> = {
    name: touched.name ? parsed.name?.[0] : undefined,
    email: touched.email ? parsed.email?.[0] : undefined,
    password: touched.password ? parsed.password?.[0] : undefined
  }

  const hasErrors = Boolean(errors.name || errors.email || errors.password)

  return (
    <>
      <Input
        IconLeft={FaRegUser}
        type="text"
        placeholder="Insira seu nome"
        onChange={(e) => setName(e.target.value)}
        onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
        value={name}
        error={errors.name}
      />
      <Input
        IconLeft={MdOutlineEmail}
        type="email"
        placeholder="Insira seu email"
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
        value={email}
        error={errors.email}
      />
      <Input
        IconLeft={BsKey}
        type="password"
        placeholder="Insira uma senha"
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
        value={password}
        error={errors.password}
      />
      <Button
        type="submit"
        label="Confirmar"
        disabled={hasErrors || name === '' || email === '' || password === ''}
        isLoading={isLoading}
      />
    </>
  )
}
