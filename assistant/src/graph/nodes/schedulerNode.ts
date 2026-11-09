import { AppointmentService } from '../../services/appointmentService.ts'
import type { GraphState } from '../graph.ts'
import { z } from 'zod/v3'

const ScheduleRequiredFieldsSchema = z
  .object({
    doctors_id: z.string({ required_error: 'Doctor ID is required' }),
    datetime: z.string({ required_error: 'Appointment datetime is required' }),
    specialties_id: z.string().optional(),
    patientName: z.string().optional(),
    patientCpf: z.string().optional(),
  })
  .refine((data) => Boolean(data.patientName || data.patientCpf), {
    message: 'Patient name or CPF is required',
  })

const CreatedAppointmentSchema = z.object({
  id: z.string().min(1),
  date: z.string().min(1),
  patients_id: z.string().min(1),
  specialties_id: z.string().min(1),
  doctors_id: z.string().min(1),
})

export function createSchedulerNode(appointmentService: AppointmentService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    try {
      const validation = ScheduleRequiredFieldsSchema.safeParse(state)

      if (!validation.success) {
        const errorMessages = validation.error.errors
          .map((error) => error.message)
          .join(', ')
        return {
          actionSuccess: false,
          actionError: errorMessages,
        }
      }

      const appointment = await appointmentService.bookAppointment({
        doctors_id: validation.data.doctors_id,
        specialties_id: validation.data.specialties_id,
        datetime: validation.data.datetime,
        patientName: validation.data.patientName,
        patientCpf: validation.data.patientCpf,
      })

      const created = CreatedAppointmentSchema.safeParse(appointment)

      if (!created.success) {
        return {
          actionSuccess: false,
          actionError: 'The server did not confirm the appointment',
        }
      }

      return {
        actionSuccess: true,
        actionError: undefined,
        datetime: created.data.date,
        appointmentData: created.data,
      }
    } catch (error) {
      return {
        actionSuccess: false,
        actionError:
          error instanceof Error ? error.message : 'Scheduling failed',
      }
    }
  }
}
