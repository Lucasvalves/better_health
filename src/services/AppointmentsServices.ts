import {
	ICreate,
	ICreateAvailableDays,
} from '../interfaces/AppointmentsInterface'
import { AppointmentsRepository } from '../repositories/AppointmentsRepository'
import { DoctorsRepository } from '../repositories/DoctorsRepository'
import { TimesRepository } from '../repositories/TimesRepository'
import { SpecialtiesRepository } from '../repositories/SpecialtiesRepository'
import { getMinutes, format, add, isBefore, addDays, addHours } from 'date-fns'

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

		// console.log('minutesService', minutesService) //30
		// console.log('duration', specialty.duration) //2029-02-01T03:30:00.000Z
		// const hour = format(specialty.duration, 'HH:mm:ss')
		// console.log('hour', hour) //00:30:00

		/* PORUCRE NOS PRÓXIMOS 365 DIAS
			ATÉ A AGENDA CONTER 7 DIAS DISPONÍVES
		 */
		let combinedDateStart
		let combinedDateEnd

		let dayWeekAvailable: boolean
		let bahia: string

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
				let allDaysTimers = {} as string

				for (let space of validSpaces) {
					////for(let id of space.doctors_id){

					// if(!allDaysTimers[bahia]){
					// 	allDaysTimers[bahia] = []
					// }
						console.log(space.doctors_id);

					//}

					//PEGAR TODOS OS HORARIOS DE ESPAÇO E JOGAR DENTRO DO COLABORADOR
					// space.Doctors = {
					// 	...
					// 	(combinedDateStart = addHours(
					// 		lastDay,
					// 		space.startHour.getHours()
					// 	)),

					// 	//minutesService,
					// }

					//allDaysTimers[space.doctors_id] = [...allDaysTimers[space.Doctors.id]]
				}
				//console.log(validSpaces);

				if (isBefore(tomorow, lastDay)) {
					schedule.push(format(lastDay, 'dd-MM-yyyy'))
				}
			}

			lastDay = add(lastDay, { days: 1 })
		}

		return {
			schedule,
		}
	}
	//combinedDateTime.setMinutes(parsedTime.getMinutes());
}
export { AppointmentsServices }
