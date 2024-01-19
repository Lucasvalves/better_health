import { prisma } from '../database/prisma'
import { ICreate } from '../interfaces/DoctorsInterfaces'

class DoctorsRepository {
	async create({ name, crm, specialties_id, user_id }: ICreate) {
		const result = await prisma.doctors.create({
			data: {
				name,
				crm,
				specialties_id,
				user_id,
			},
		})
		return result
	}

	async findByCrm(crm: string) {
		const doctor = await prisma.doctors.findFirst({
			where: {
				crm,
			},
		})
		return doctor
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

	async findDoctorId(id: string) {
		const doctor = await prisma.doctors.findFirst({
			where: {
				id,
			},
		})

		return doctor
	}
	async delete(id: string) {
		const result = await prisma.doctors.delete({
			where: { id },
		})
		return result
	}
}
export { DoctorsRepository }
