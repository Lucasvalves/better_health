import {
  CreateScheduleBody,
  CreateScheduleServiceContract
} from '@/data/schedule-service/create-times-service/create-schedule-service'
import { CreateSchedule, Schedule } from '@/domain/models/schedule'

export class InMemoryCreateScheduleService
  implements CreateScheduleServiceContract
{
  async exec({ body, token }: CreateSchedule): Promise<Schedule> {
    if (!token) {
      throw new Error('Token not found')
    }

    const scheduleBody: CreateScheduleBody = {
      days: body.days,
      startHour: body.startHour,
      endHour: body.endHour,
      specialties_id: body.specialties_id,
      doctors_id: body.doctors_id
    }

    return scheduleBody
  }
}
