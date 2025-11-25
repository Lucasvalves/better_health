import { prisma } from '../database/prisma'
import { ICreateDB } from '../interfaces/TimesInterfaces'

class TimesRepository {
	async create({
		days,
		startHour,
		endHour,
		specialties_id,
		doctors_id,
	}: ICreateDB) {
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
				Specialties: true,
			},
		})
		return result
	}
	async allTimes() {
		const result = await prisma.times.findMany({
			include: {
				Doctors: true, // Include user data in the returned object
				Specialties: true,
			},
		})

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
	async findByDoctorAndDay(doctors_id: string, day: number) {
		const result = await prisma.times.findMany({
			where: {
				doctors_id,
				days: day,
			},
		})

		return result
	}
}

export { TimesRepository }
