import { z } from 'zod'
import type { ProfessionalForPrompt } from '../../services/appointmentService.ts'

export const IntentSchema = z.object({
  intent: z
    .enum(['schedule', 'cancel', 'unknown'])
    .describe('The user intent'),
  doctors_id: z
    .string()
    .optional()
    .describe('UUID of the doctor matched from the professionals list'),
  specialties_id: z
    .string()
    .optional()
    .describe('UUID of the specialty for the doctor or request'),
  doctorName: z
    .string()
    .optional()
    .describe('Doctor name as mentioned by the user'),
  datetime: z
    .string()
    .optional()
    .describe('Appointment date and time in ISO format'),
  patientName: z
    .string()
    .optional()
    .describe('Patient name extracted from the question'),
  patientCpf: z
    .string()
    .optional()
    .describe('Patient CPF digits if mentioned'),
  appointmentId: z
    .string()
    .optional()
    .describe('Existing appointment UUID when cancelling by id'),
  reason: z
    .string()
    .optional()
    .describe('Reason for appointment (for scheduling)'),
})

export type IntentData = z.infer<typeof IntentSchema>

export const getSystemPrompt = (professionals: ProfessionalForPrompt[]) => {
  return JSON.stringify({
    role: 'Intent Classifier for Medical Appointments',
    task: 'Identify user intent and extract all appointment-related details',
    professionals: professionals.map((professional) => ({
      id: professional.id,
      name: professional.name,
      specialty: professional.specialty,
      specialties_id: professional.specialties_id,
    })),
    current_date: new Date().toISOString(),
    rules: {
      schedule: {
        description: 'User wants to book/schedule a new appointment',
        keywords: ['agendar', 'marcar', 'schedule', 'book', 'appointment'],
        required_fields: ['doctors_id', 'datetime', 'patientName or patientCpf'],
        optional_fields: ['reason', 'specialties_id', 'patientCpf'],
      },
      cancel: {
        description: 'User wants to cancel an existing appointment',
        keywords: ['cancelar', 'cancel', 'remover', 'desmarcar'],
        required_fields: [
          'appointmentId OR (doctors_id + datetime + patientName/patientCpf)',
        ],
      },
      unknown: {
        description:
          'Anything not related to scheduling or cancelling appointments',
        examples: ['weather questions', 'general info', 'unrelated queries'],
      },
    },
    extraction_instructions: {
      doctors_id:
        'Match the doctor name mentioned in the question to the id from the professionals list. Use fuzzy matching. Always return the UUID string.',
      specialties_id:
        'Use the specialties_id from the matched professional when available.',
      doctorName: 'Extract the doctor name as mentioned by the user',
      datetime:
        'Parse relative dates (today, tomorrow) and times. Convert to ISO format. Use current_date as reference.',
      patientName: 'Extract the patient name from the question or context',
      patientCpf: 'Extract CPF digits only when the user provides a CPF',
      appointmentId: 'Extract appointment UUID only when explicitly provided',
      reason: 'Extract the reason/purpose for the appointment (only for scheduling)',
    },
    examples: [
      {
        input:
          'Quero agendar com Dr. Alicio da Silva amanhã às 16h para check-up, sou Maria Santos',
        output: {
          intent: 'schedule',
          doctors_id: '6b4423bb-c816-4dd6-92f5-3a770bd7dea3',
          specialties_id: '02d6b88f-8c1d-4da5-b4ac-1945d5b9c3c6',
          doctorName: 'Dr. Alicio da Silva',
          datetime: '2026-02-12T16:00:00.000Z',
          patientName: 'Maria Santos',
          reason: 'check-up',
        },
      },
      {
        input:
          'Cancele minha consulta com Dra. Ana Pereira hoje às 11h, me chamo Joao da Silva',
        output: {
          intent: 'cancel',
          doctors_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          doctorName: 'Dra. Ana Pereira',
          datetime: '2026-02-11T11:00:00.000Z',
          patientName: 'Joao da Silva',
        },
      },
      {
        input: 'Qual o clima hoje?',
        output: { intent: 'unknown' },
      },
    ],
  })
}

export const getUserPromptTemplate = (question: string) => {
  return JSON.stringify({
    question,
    instructions: [
      'Carefully analyze the question to determine the user intent',
      'Extract all relevant appointment details',
      'Convert dates and times to ISO format',
      'Match doctor names to their UUID ids from the professionals list',
      'Return only the fields that are present in the question',
    ],
  })
}
