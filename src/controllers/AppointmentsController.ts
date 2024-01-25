import { Request, Response, NextFunction } from 'express'

import { TimesServices } from '../services/TimesServices'
import { AppointmentsServices } from '../services/AppointmentsServices'
import {
	IFilter,
	IRange
} from '../interfaces/AppointmentsInterface'
class AppointmentsController {
	private appointmentsServices: AppointmentsServices
	constructor() {
		this.appointmentsServices = new AppointmentsServices()
	}
	async store(request: Request, response: Response, next: NextFunction) {
		const { patients_id, specialties_id, doctors_id, date } = request.body

		//verificar se existe horario disponivel

		try {
			const result = await this.appointmentsServices.store({
				patients_id,
				specialties_id,
				doctors_id,
				date,
			})
			return response.json(result)
		} catch (error) {
			next(error)
		}
	}
	async index(request: Request, response: Response, next: NextFunction) {
		const { range, specialties_id }: { range: IRange; specialties_id: string } = request.body;

		try {
			const result = await this.appointmentsServices.index({range, specialties_id})
			return response.json(result)

		} catch (error) {
			next(error)
		}
	}
	async availableDays(
		request: Request,
		response: Response,
		next: NextFunction
	) {
		const { date, specialties_id } = request.body
		try {
			const result = await this.appointmentsServices.availableDays({
				date,
				specialties_id,
			})

			return response.json(result)
		} catch (error) {
			next(error)
		}
	}
}
export { AppointmentsController }
