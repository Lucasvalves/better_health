import { AppointmentService } from '../../services/appointmentService.ts'
import { DoctorSelectionError } from '../../services/doctorResolver.ts'
import type { GraphState } from '../graph.ts'
import { PatientCpfSchema } from './patientCpfSchema.ts'
import { z } from 'zod/v3'

const ScheduleRequiredFieldsSchema = z
  .object({
    patientCpf: PatientCpfSchema,
    datetime: z.string({ required_error: 'Appointment datetime is required' }),
    doctorCrm: z.string().trim().optional(),
    doctorName: z.string().trim().optional(),
    specialtyName: z.string().trim().optional(),
  })
  .refine(
    (data) =>
      Boolean(data.doctorCrm || data.doctorName || data.specialtyName),
    { message: 'Doctor name, CRM or specialty is required' },
  )

const CreatedAppointmentSchema = z.object({
  id: z.string().min(1),
  date: z.string().min(1),
  patients_id: z.string().min(1),
  specialties_id: z.string().min(1),
  doctors_id: z.string().min(1),
})

export function createSchedulerNode(
  appointmentService: AppointmentService,
  now: () => Date = () => new Date(),
) {
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
          doctorOptions: undefined,
        }
      }

      if (new Date(validation.data.datetime).getTime() <= now().getTime()) {
        return {
          actionSuccess: false,
          actionError: 'The requested date and time have already passed',
        }
      }

      const { appointment, doctor } = await appointmentService.bookAppointment({
        doctorCrm: validation.data.doctorCrm,
        doctorName: validation.data.doctorName,
        specialtyName: validation.data.specialtyName,
        datetime: validation.data.datetime,
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
        doctorName: doctor.name,
        datetime: created.data.date,
        appointmentData: created.data,
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
          error instanceof Error ? error.message : 'Scheduling failed',
      }
    }
  }
}
