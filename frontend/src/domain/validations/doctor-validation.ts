import { z } from 'zod'

export const DoctorSchema = z.object({
  name: z
    .string()
    .min(1, 'O nome é obrigatório.')
    .min(3, 'O nome está muito curto.'),

  crm: z
    .string()
    .min(1, 'O CRM é obrigatório.')
    .refine((v) => v.replace(/\D/g, '').length >= 4, 'CRM inválido.'),

  specialties_id: z.string().min(1, 'Selecione uma especialidade.')
})
