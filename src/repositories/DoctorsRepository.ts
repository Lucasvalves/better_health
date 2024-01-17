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
		const doctor = await prisma.doctors.findFirst({
			where: {
				crm,
			},
		})
		return doctor
	}

	async findDoctorsById(user_id: string) {
		const doctors = await prisma.doctors.findMany({
			where: {
				user_id,
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

	async findSpecialties(specialties: string) {

		const result = await prisma.doctors.findMany({
			where: {
				specialties,
			},
		})

		return result
	}
}
export { DoctorsRepository }
