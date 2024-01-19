import {
	ICreate,
	ICreateAvailableDays,
} from '../interfaces/AppointmentsInterface'
import { AppointmentsRepository } from '../repositories/AppointmentsRepository'
import { DoctorsRepository } from '../repositories/DoctorsRepository'
import { TimesRepository } from '../repositories/TimesRepository'
import { SpecialtiesRepository } from '../repositories/SpecialtiesRepository'
import {  getMinutes } from 'date-fns'

class AppointmentsServices {
	private appointmentsRepository: AppointmentsRepository
	private specialtiesRepository: SpecialtiesRepository
	private timesRepository:TimesRepository
	constructor() {
		this.appointmentsRepository = new AppointmentsRepository()
		this.specialtiesRepository = new SpecialtiesRepository()
		this.timesRepository = new TimesRepository()

	}
	async store({ date, patients_id, doctors_id, users_id }: ICreate) {
		const result = this.appointmentsRepository.create({
			date,
			patients_id,
			doctors_id,
			users_id,
		})
		return result
	}
	async availableDays({ date, specialties_id, user_id }: ICreateAvailableDays) {

		console.log(specialties_id);


		//const dateFormatted = getMinutes(duracao)


		//const result = await this.specialtiesRepository.find(specialties_id)
		const findByTimersSpecialties =  await this.timesRepository.findBySpecialties(specialties_id)
		const specialty = await this.specialtiesRepository.find(specialties_id)

		//console.log(findByTimersSpecialties);
		console.log("formated",specialty)


		//return result
		return findByTimersSpecialties
	}
}
export { AppointmentsServices }
