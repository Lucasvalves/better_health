import { AppointmentService } from '../../services/appointmentService.ts'
import { DoctorSelectionError } from '../../services/doctorResolver.ts'
import type { GraphState } from '../graph.ts'
import { PatientCpfSchema } from './patientCpfSchema.ts'
import { z } from 'zod/v3'

const CancelRequiredFieldsSchema = z
  .object({
    patientCpf: PatientCpfSchema,
    appointmentId: z.string().optional(),
    doctorCrm: z.string().trim().optional(),
    doctorName: z.string().trim().optional(),
    datetime: z.string().optional(),
  })
  .refine(
    (data) =>
      Boolean(data.appointmentId) ||
      (Boolean(data.doctorCrm || data.doctorName) && Boolean(data.datetime)),
    {
      message: 'Appointment ID or doctor and datetime are required',
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
        patientCpf: validation.data.patientCpf,
        appointmentId: validation.data.appointmentId,
        doctorCrm: validation.data.doctorCrm,
        doctorName: validation.data.doctorName,
        datetime: validation.data.datetime,
      })

      return {
        actionSuccess: true,
      }
    } catch (error) {
      if (error instanceof DoctorSelectionError) {
        return {
          actionSuccess: false,
          actionError: error.message,
          doctorOptions: error.options,
        }
      }

      return {
        actionSuccess: false,
        actionError:
          error instanceof Error ? error.message : 'Cancellation failed',
      }
    }
  }
}
