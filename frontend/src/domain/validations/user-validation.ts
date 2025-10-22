import { z } from 'zod'

export const signUpSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório.').trim(),
  email: z
    .string()
    .min(1, 'E-mail é obrigatório.')
    .refine((val) => val.includes('@') && val.includes('.'), {
      message: 'Informe um e-mail válido.'
    }),
  password: z
    .string()
    .min(8, 'A senha deve ter ao menos 8 caracteres.')
    .regex(/[a-z]/, 'A senha deve conter uma letra minúscula.')
    .regex(/[A-Z]/, 'A senha deve conter uma letra maiúscula.')
    .regex(/[0-9]/, 'A senha deve conter um número.')
})

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail é obrigatório.')
    .refine((val) => val.includes('@') && val.includes('.'), {
      message: 'Informe um e-mail válido.'
    }),
  password: z.string().min(1, 'Senha é obrigatória.')
})


export type SignUpFormData = z.infer<typeof signUpSchema>
export type LoginFormData = z.infer<typeof loginSchema>

