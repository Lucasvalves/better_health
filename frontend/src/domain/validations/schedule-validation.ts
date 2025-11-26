import { z } from 'zod'

export const scheduleSchema = z.object({
  crm: z
    .string()
    .min(1, 'CRM é obrigatório')
    .regex(/^\d+$/, 'CRM deve conter apenas números'),

  startHour: z.string().min(1, 'Hora de início é obrigatória'),

  endHour: z.string().min(1, 'Hora de fim é obrigatória'),

  selectedDate: z.date().refine((val) => !!val, {
    message: 'A data é obrigatória'
  })
})
