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
	// async findByDoctors(doctors_id: string) {
	// 	const result = await prisma.times.findMany({
	// 		where: {
	// 			doctors_id,
	// 		},
	// 		select: {
	// 			//data: { // nome da propriedade que deseja
	// 				days: true, // indica que queremos apenas a parte da data
	// 			//},
	// 		},
	// 	})
	// 	return result
	// 	//console.log(result)
	// }
}

export { TimesRepository }
