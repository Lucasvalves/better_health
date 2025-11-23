import { z } from 'zod'

export const PatientSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.').min(3, 'Nome muito curto.'),
  cpf: z
    .string()
    .refine((v) => v.replace(/\D/g, '').length === 11, 'CPF inválido.'),
  phone: z
    .string()
    .refine((v) => v.replace(/\D/g, '').length >= 10, 'Telefone inválido.')
})
