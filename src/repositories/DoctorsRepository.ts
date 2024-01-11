import { prisma } from '../database/prisma'
import { Icreate } from '../interfaces/DoctorsInterfaces'

class DoctorsRepository {
	async create({ name, crm, specialties, user_id }: Icreate) {
		const result = await prisma.doctors.create({
			data: {
				name,
				crm,
				specialties,
				user_id,
			},
		})
		return result
	}

	async findByCrm(crm: string) {
		const result = await prisma.doctors.findFirst({
			where: {
				crm,
			},
		})
		return result
	}
}
export { DoctorsRepository }
