import { AppointmentService } from '../../services/appointmentService.ts'
import type { GraphState } from '../graph.ts'
import { z } from 'zod/v3'

const CancelRequiredFieldsSchema = z
  .object({
    appointmentId: z.string().optional(),
    doctors_id: z.string().optional(),
    datetime: z.string().optional(),
    patientName: z.string().optional(),
    patientCpf: z.string().optional(),
  })
  .refine(
    (data) =>
      Boolean(data.appointmentId) ||
      (Boolean(data.doctors_id) &&
        Boolean(data.datetime) &&
        Boolean(data.patientName || data.patientCpf)),
    {
      message:
        'Appointment ID or doctor, datetime, and patient name/CPF are required',
    },
  )

export function createCancellerNode(appointmentService: AppointmentService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    try {
      const validation = CancelRequiredFieldsSchema.safeParse(state)
      if (!validation.success) {
        const errorMessages = validation.error.errors
          .map((error) => error.message)
          .join(', ')
        return {
          actionSuccess: false,
          actionError: errorMessages,
        }
      }

      await appointmentService.cancelAppointment({
        appointmentId: validation.data.appointmentId,
        doctors_id: validation.data.doctors_id,
        datetime: validation.data.datetime,
        patientName: validation.data.patientName,
        patientCpf: validation.data.patientCpf,
      })

      return {
        actionSuccess: true,
      }
    } catch (error) {
      return {
        actionSuccess: false,
        actionError:
          error instanceof Error ? error.message : 'Cancellation failed',
      }
    }
  }
}
