import { endOfDay, startOfDay } from 'date-fns'
import { prisma } from '../database/prisma'
import { ICreate,IRangeRepository } from '../interfaces/AppointmentsInterface'

class AppointmentsRepository {
	async create({ patients_id, specialties_id, doctors_id, date }: ICreate) {
		const result = await prisma.appointments.create({
			data: {
				patients_id,
				specialties_id,
				doctors_id,
				date,
			},
		})
		return result
	}
	async find({ specialties_id, start, end}:IRangeRepository) {
			const result = await prisma.appointments.findMany({
				where: {
					specialties_id,
					date:{
						gte: start, //trazendo agendamentos a partir do dia informado
						lt: end
					 }
				},
				orderBy: {
				  date: 'asc', //ordenando de forma crescente
				},
			})
			return result
		}
		async findDoctorsByUserId(user_id: string) {
			const doctors = await prisma.doctors.findMany({
				where: {
					user_id,
				},
				include: {
					Specialties: true,
				},
			})
			return doctors
		}
}

export { AppointmentsRepository }



