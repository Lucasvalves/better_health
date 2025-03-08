import { prisma } from '../database/prisma'

class SpecialtiesRepository {
	async create(name: string, dateFormatted: Date) {
		const result = await prisma.specialties.create({
			data: {
				name,
				duration: dateFormatted,
			},
		})
		return result
	}
	async findSpecialtyByName(name: string) {
		const result = await prisma.specialties.findUnique({
			where: {
				name,
			},
		})
		return result
	}
	async getAll() {
		const specialties = await prisma.specialties.findMany()

		return specialties
	}
	async find(id: string) {
		const specialty = await prisma.specialties.findFirst({
			where: {
				id,
			},
		})
		return specialty
	}
}

export { SpecialtiesRepository }
