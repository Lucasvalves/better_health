import { ICreate } from '../interfaces/TimesInterfaces'
import { DoctorsRepository } from '../repositories/DoctorsRepository'
import { TimesRepository } from '../repositories/TimesRepository'
import { convertHourToDateTime } from '../utils/util'

class TimesServices {
	private timesRepository: TimesRepository
	private doctorsRepository: DoctorsRepository

	constructor() {
		this.timesRepository = new TimesRepository()
		this.doctorsRepository = new DoctorsRepository()
	}
	async store({
		days,
		startHour,
		endHour,
		doctors_id,
		specialties_id,
	}: ICreate) {
		const findDoctorSpecialties = await this.doctorsRepository.findDoctorId(
			doctors_id
		)

		if (findDoctorSpecialties?.specialties_id != specialties_id) {
			throw new Error('This doctor does not provide the specified specialty')
		}

		const formattedStart = convertHourToDateTime(startHour)
		const formattedEnd = convertHourToDateTime(endHour)

		const existingTimes = await this.timesRepository.findByDoctorAndDay(
			doctors_id,
			days
		)

		const conflict = existingTimes.some((t) => {
			const existingStart = new Date(t.startHour)
			const existingEnd = new Date(t.endHour)

			return formattedStart < existingEnd && existingStart < formattedEnd
		})

		if (conflict) {
			throw new Error('This doctor already has a schedule at this time')
		}

		const result = await this.timesRepository.create({
			days,
			startHour: formattedStart,
			endHour: formattedEnd,
			specialties_id,
			doctors_id,
		})

		return result
	}

	async find() {
		const result = await this.timesRepository.allTimes()
		return result
	}
	async findBySpecialties(specialties_id: string) {
		const result = await this.timesRepository.findBySpecialties(specialties_id)

		if (result.length === 0) {
			throw new Error("specialties_id doesn't exists")
		}

		console.log(result)

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
