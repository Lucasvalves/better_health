import { prisma } from '../database/prisma'
import { ICreate } from '../interfaces/AppointmentsInterface'

class AppointmentsRepository {
	async create({ date, patients_id, doctors_id, users_id }: ICreate) {
		const create = await prisma.appointments.create({
			data: {
				date,
				patients_id,
				doctors_id,
				users_id,
			},
			include: {
				Users: true, // Include user data in the returned object
			},
		})

		return create
	}
}

export { AppointmentsRepository }
