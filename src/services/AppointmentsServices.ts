import {
	ICreate,
	ICreateAvailableDays,
	IFilter,
} from '../interfaces/AppointmentsInterface'
import { AppointmentsRepository } from '../repositories/AppointmentsRepository'
import { DoctorsRepository } from '../repositories/DoctorsRepository'
import { TimesRepository } from '../repositories/TimesRepository'
import { SpecialtiesRepository } from '../repositories/SpecialtiesRepository'
import {
	getMinutes,
	add,
	isBefore,
	addDays,
	addHours,
	format,
	toDate,
	endOfDay,
	startOfDay,
} from 'date-fns'
import { util } from '../util'
import { PatientsRepository } from '../repositories/PatientsRepository'

class AppointmentsServices {
	private appointmentsRepository: AppointmentsRepository
	private patientsRepository: PatientsRepository
	private doctorsRepository: DoctorsRepository
	private specialtiesRepository: SpecialtiesRepository
	private timesRepository: TimesRepository
	constructor() {
		this.appointmentsRepository = new AppointmentsRepository()
		this.patientsRepository = new PatientsRepository()
		this.doctorsRepository = new DoctorsRepository()
		this.specialtiesRepository = new SpecialtiesRepository()
		this.timesRepository = new TimesRepository()
	}
	async store({ patients_id, specialties_id, doctors_id, date }: ICreate) {
		const doctors = await this.doctorsRepository.findDoctorId(doctors_id)
		const specialty = await this.specialtiesRepository.find(specialties_id)
		const patients = await this.patientsRepository.findPatient(patients_id)

		if (specialty?.id != doctors?.specialties_id) {
			throw new Error('This doctor does not provide the specified specialty')
		}
		if (!patients) {
			throw new Error('Invalid patient')
		}

		const result = await this.appointmentsRepository.create({
			patients_id,
			specialties_id,
			doctors_id,
			date,
		})

		return result
	}

	async index({ range, specialties_id }: IFilter) {
		//console.log()

		if (range.start != undefined && range.end != undefined) {
			let start = range.start
			let end = range.end
			start = startOfDay(new Date(start))
			end =  endOfDay(new Date(end))


			const result = await this.appointmentsRepository.find({specialties_id,start, end})
			return result
		}

		throw new Error('Start date or end date not specified')
	}
	async availableDays({ date, specialties_id }: ICreateAvailableDays) {
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
