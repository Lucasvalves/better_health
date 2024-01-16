import { prisma } from '../database/prisma'
import { ICreate } from '../interfaces/AppointmentsInterface'

class AppointmentsRepository {
	async create({ id, date, patients_id, doctors_id, users_id }: ICreate) {
		const create = await prisma.appointments.create({
			data: {
				id,
				date,
				patients_id,
				doctors_id,
				users_id,
			},
		})

		return create
	}
}

export { AppointmentsRepository }
