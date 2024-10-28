import { NextFunction, Request, Response } from 'express'

import { TimesServices } from '../services/TimesServices'

class TimesController {
	private timesServices: TimesServices
	constructor() {
		this.timesServices = new TimesServices()
	}
	async store(request: Request, response: Response, next: NextFunction):Promise<void> {
		const { days, startHour, endHour,specialties_id, doctors_id } =
			request.body

		try {
			const result = await this.timesServices.store({
				days,
				startHour,
				endHour,
				specialties_id,
				doctors_id,

			})
			response.status(201).json(result)
		} catch (error) {
			next(error)
		}
	}
	async find(request: Request, response: Response, next: NextFunction):Promise<void>{

		try {
			const result = await this.timesServices.find()

			response.status(200).json(result)
		} catch (error) {
			next(error)
		}

	}
	async findBySpecialties(request: Request, response: Response, next: NextFunction):Promise<void>{
		const {specialties_id} = request.body

		try {
			const result = await this.timesServices.findBySpecialties(specialties_id)

			response.status(200).json(result)

		} catch (error) {
			next(error)
		}
	}
	async delete(request: Request, response: Response, next: NextFunction):Promise<void>{

		const {id} = request.params

		try {
			const result = await this.timesServices.delete(id)

			response.status(200).json(result)

		} catch (error) {
			next(error)
		}
	}
}
export { TimesController }


