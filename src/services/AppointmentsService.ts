import { ICreate } from '../interfaces/AppointmentsInterface'
import { AppointmentsRepository } from '../repositories/AppointmentsRepository'

class AppointmentsService {
	private appointmentsRepository: AppointmentsRepository

	constructor() {
		this.appointmentsRepository = new AppointmentsRepository()
	}
	async store({ id, date, patients_id, doctors_id, users_id }: ICreate) {
		const result = this.appointmentsRepository.create({
			id,
			date,
			patients_id,
			doctors_id,
			users_id,
		})
		return result
	}
}
export { AppointmentsService }
