import { format, toDate } from 'date-fns'
import {
	ICreate,
	ICreateAvailableDays,
} from '../interfaces/AppointmentsInterface'
import { AppointmentsRepository } from '../repositories/AppointmentsRepository'
import { DoctorsRepository } from '../repositories/DoctorsRepository'
import { TimesRepository } from '../repositories/TimesRepository'
import { SpecialtiesRepository } from '../repositories/SpecialtiesRepository'
import { getMinutes, add, isBefore, addDays, addHours } from 'date-fns'
import { util } from '../util'

class AppointmentsServices {
	private appointmentsRepository: AppointmentsRepository
	private specialtiesRepository: SpecialtiesRepository
	private timesRepository: TimesRepository
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
		const specialty = await this.specialtiesRepository.find(specialties_id)
		//const result = await this.specialtiesRepository.find(specialties_id)

		//verificando se specialidade solicitada existe
		if (!specialty) {
			throw new Error("Specialty doens't exists")
		}
		const schedule = []
		let lastDay = new Date(date)
		const tomorow = addDays(new Date(), 1)

		const minutesService = getMinutes(specialty.duration)

		const timers = await this.timesRepository.allTimes()


		/* PORUCRE NOS PRÓXIMOS 365 DIAS
			ATÉ A AGENDA CONTER 7 DIAS DISPONÍVES
		 */

		const SLOT_DURATION = 30
		let dayWeekAvailable: boolean

		for (let i = 0; i <= 365 && schedule.length <= 7; i++) {
			const validSpaces = timers.filter((timer) => {
				//verificar o dia da semana
				const timerString = timer.days.toString()
				dayWeekAvailable = timerString.includes(
					lastDay.getDay().toLocaleString('pt-BR')
				)

				//verificar especialidade disponivel
				const serviceAvailable = timer.specialties_id.includes(specialties_id)

				return dayWeekAvailable && serviceAvailable
			})

			//TODOS OS DOCTORS DISPONIVEIS NO DIA E SEUS HORÁRIOS

			if (validSpaces.length > 0) {
				let allDaysTimers = {}

				for (let space of validSpaces) {
					allDaysTimers = [
						space.Doctors.id,
						space.Doctors.name,
						util(
							format(lastDay, 'yyyy-MM-dd'),
							format(addHours(space.startHour, +3), 'HH:mm'),
							format(addHours(space.endHour, +3), 'HH:mm'),
							SLOT_DURATION
						),
					]
				}

				//OCUPAÇÃO DE CADA ESPECIALISTA NO DIA

 
				if (isBefore(tomorow, lastDay)) {
					schedule.push({
						[format(lastDay, 'dd-MM-yyyy')]: allDaysTimers,
					})
				}
			}

			lastDay = add(lastDay, { days: 1 })
		}

		return {
			schedule,
		}
	}
}
export { AppointmentsServices }
