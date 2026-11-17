import { z } from 'zod/v3'

export const PatientCpfSchema = z
  .string({ required_error: 'Patient CPF is required' })
  .transform((value) => value.replace(/\D/g, ''))
  .refine((value) => value.length === 11, {
    message: 'Patient CPF must have 11 digits',
  })
