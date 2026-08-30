import { Request, Response, NextFunction } from 'express'

import { AppointmentsServices } from '../services/AppointmentsServices'
import { IRange } from '../interfaces/AppointmentsInterface'
class AppointmentsController {
	private appointmentsServices: AppointmentsServices
	constructor() {
		this.appointmentsServices = new AppointmentsServices()
	}
	async store(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const { patients_id, specialties_id, doctors_id, date } = request.body

		//verificar se existe horario disponivel

		try {
			const result = await this.appointmentsServices.store({
				patients_id,
				specialties_id,
				doctors_id,
				date,
			})
			response.status(201).json(result)
		} catch (error) {
			next(error)
		}
	}
	async index(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const { range, specialties_id }: { range: IRange; specialties_id: string } =
			request.body

		try {
			const result = await this.appointmentsServices.index({
				range,
				specialties_id,
			})
			response.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}
	async availableDays(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const { date, specialties_id } = request.body
		try {
			const result = await this.appointmentsServices.availableDays({
				date,
				specialties_id,
			})

			response.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}

	async findAppointmentsPatient(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const { patient_id } = request.body

		try {
			const result = await this.appointmentsServices.findAppointmentsPatient(
				patient_id
			)

			response.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}

	async delete(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const { id } = request.params

		try {
			const result = await this.appointmentsServices.delete(id)

			response.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}

	async update(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const { id } = request.params
		const { newDate } = request.body


		try {
			const result = await this.appointmentsServices.update(id, newDate)

			response.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}
}
export { AppointmentsController }
