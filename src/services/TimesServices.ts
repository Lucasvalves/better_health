import { ICreate } from '../interfaces/TimesInterfaces'
import { DoctorsRepository } from '../repositories/DoctorsRepository'
import { TimesRepository } from '../repositories/TimesRepository'

class TimesServices {
	private timesRepository: TimesRepository
	private doctorsRepository: DoctorsRepository

	constructor() {
		this.timesRepository = new TimesRepository()
		this.doctorsRepository = new DoctorsRepository()
	}
	async store({ days, startHour, endHour, doctors_id, specialties_id, }: ICreate) {

		const findDoctorSpecialties = await this.doctorsRepository.findDoctorId(doctors_id)

		if(findDoctorSpecialties?.specialties_id != specialties_id){
			throw new Error('This doctor does not provide the specified specialty')

		}





		const result = await this.timesRepository.create({
			days,
			startHour,
			endHour,
			specialties_id,
			doctors_id,
		})

		return result
	}
	async find() {
		const result = await this.timesRepository.allTimes()
		return result

	}
	async findBySpecialties(specialties_id:string) {
		const result = await this.timesRepository.findBySpecialties(specialties_id)
		return result

	}
	async delete(id: string) {
		const result = await this.timesRepository.delete(id)

		if (!result) {
			throw new Error("Patient doens't exists")
		}

		return result
	}
}

export { TimesServices }
