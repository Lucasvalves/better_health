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
		async findByDoctorsId(doctors_id:string, lastDay:Date) {
			const result = await prisma.appointments.findMany({
				where: {
					doctors_id,

					date:{//trazendo agendamentos do doctor no dia informado
						gte: startOfDay(lastDay),
						lt:endOfDay(lastDay),
					 }
				}, select: {
						date: true, // indica que queremos apenas a parte da data
						Specialties:true,
						Doctors:true,
				},
				orderBy: {
				  date: 'asc', //ordenando de forma crescente
				},

			})
			return result



		}
}

export { AppointmentsRepository }




