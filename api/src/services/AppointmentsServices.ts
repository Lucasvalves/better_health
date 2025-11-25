import {
	ICreate,
	ICreateAvailableDays,
	IFilter,
	IObject,
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
	endOfDay,
	startOfDay,
	getHours,
	getDay,
	addMinutes,
} from 'date-fns'
import {
	breakTimeRange,
	addMinutesToDate,
	splitByvalue,
	chunk,
	normalize,
} from '../utils/util'
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

		if (!specialty) {
			throw new Error('Invalid specialty')
		}
		if (specialty?.id != doctors?.specialties_id) {
			throw new Error('This doctor does not provide the specified specialty')
		}
		if (!patients) {
			throw new Error('Invalid patient')
		}

		const dayOfWeek = getDay(date)

		const doctorTimes = await this.timesRepository.findByDoctorAndDay(
			doctors_id,
			dayOfWeek
		)

		if (doctorTimes.length === 0) {
			throw new Error('This doctor is not available on this day')
		}

		const appointmentStart = new Date(date)
		const appointmentEnd = addMinutes(date, getMinutes(specialty.duration))

		const fitsInSchedule = doctorTimes.some((t) => {
			const start = normalize(appointmentStart, new Date(t.startHour))
			const end = normalize(appointmentStart, new Date(t.endHour))

			return appointmentStart >= start && appointmentEnd <= end
		})

		if (!fitsInSchedule) {
			throw new Error('This time is outside the doctor schedule')
		}

		const existingAppointments =
			await this.appointmentsRepository.findByDoctorsId(doctors_id, date)

		const hasConflict = existingAppointments.some((app) => {
			const existingStart = app.date
			const existingEnd = addMinutes(
				app.date,
				getMinutes(app.Specialties.duration)
			)

			return appointmentStart < existingEnd && existingStart < appointmentEnd
		})

		if (hasConflict) {
			throw new Error('This doctor already has an appointment at this time')
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
		if (range.start != undefined && range.end != undefined) {
			let start = range.start
			let end = range.end
			start = startOfDay(new Date(start))
			end = endOfDay(new Date(end))

			const result = await this.appointmentsRepository.find({
				specialties_id,
				start,
				end,
			})
			return result
		}

		throw new Error('Start date or end date not specified')
	}

	async availableDays({ date, specialties_id }: ICreateAvailableDays) {
		const specialty = await this.specialtiesRepository.find(specialties_id)
		if (!specialty) {
			throw new Error("Specialty doens't exists")
		}
		const schedule = []
		let doctrs: IObject = []
		let lastDay = new Date(date)
		const tomorow = addDays(new Date(), 1)

		const minutesDuration = getMinutes(specialty.duration)

		const timers = await this.timesRepository.allTimes()
		let dayWeekAvailable: boolean

		for (let i = 0; i <= 365 && schedule.length <= 7; i++) {
			const validSpaces = timers.filter((timer) => {
				const timerString = timer.days.toString()
				dayWeekAvailable = timerString.includes(
					lastDay.getDay().toLocaleString('pt-BR')
				)

				const serviceAvailable = timer.specialties_id.includes(specialties_id)

				return dayWeekAvailable && serviceAvailable
			})

			if (validSpaces.length > 0) {
				let allDayTimers: IObject = {}
				for (let space of validSpaces) {
					let doctors_id = space.doctors_id
					if (!allDayTimers[doctors_id]) {
						allDayTimers[doctors_id] = []
					}

					allDayTimers[doctors_id] = [
						...allDayTimers[doctors_id],
						...breakTimeRange(
							format(lastDay, 'yyyy-MM-dd'),
							format(addHours(space.startHour, +3), 'HH:mm'),
							format(addHours(space.endHour, +3), 'HH:mm'),
							minutesDuration
						),
					]
				}
				for (let doctors_id of Object.keys(allDayTimers)) {
					const schedules = await this.appointmentsRepository.findByDoctorsId(
						doctors_id,
						lastDay
					)

					let busySchedules: IObject = schedules
						.map((schedule) => ({
							start: format(addHours(schedule.date, +3), 'HH:mm'),
							end: addMinutesToDate(
								addHours(schedule.date, +3),
								schedule.Specialties.duration
							),
						}))
						.flat()

					busySchedules = busySchedules
						.map((timer: string) => Object.values(timer))
						.flat()

					let freeTimer: IObject = splitByvalue(
						allDayTimers[doctors_id]?.map((freeTimer: string) => {
							return busySchedules.includes(freeTimer) ? '-' : freeTimer
						}),
						'-'
					)
						.filter((space) => space.length > 0)
						.flat()

					freeTimer = chunk(freeTimer, 2)

					allDayTimers[doctors_id] = freeTimer
				}
				const doctorsTotal = Object.keys(allDayTimers).length
				if (doctorsTotal > 0) {
					if (isBefore(tomorow, lastDay)) {
						doctrs.push(Object.keys(allDayTimers))
						schedule.push({
							[format(lastDay, 'dd-MM-yyyy')]: allDayTimers,
						})
					}
				}
			}

			lastDay = add(lastDay, { days: 1 })
		}

		doctrs = [...new Set(doctrs.flat())]

		return {
			doctrs,
			schedule,
		}
	}
}
export { AppointmentsServices }
