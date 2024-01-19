import { prisma } from '../database/prisma'
import { ICreate } from '../interfaces/TimesInterfaces'

class TimesRepository {
	async create({
		days,
		startHour,
		endHour,
		specialties_id,
		doctors_id,
	}: ICreate) {
		const result = await prisma.times.create({
			data: {
				days,
				startHour,
				endHour,
				specialties_id,
				doctors_id,
			},
			include: {
				Doctors: true, // Include user data in the returned object
			},
		})
		return result
	}
	async allTimes() {
		const result = await prisma.times.findMany()

		return result
	}
	async findBySpecialties(specialties_id: string) {
		const result = await prisma.times.findMany({
			where: {
				specialties_id,
			},
		})

		return result
	}
	async delete(id: string) {
		const result = await prisma.times.delete({
			where: { id },
		})
		return result
	}
}

export { TimesRepository }
