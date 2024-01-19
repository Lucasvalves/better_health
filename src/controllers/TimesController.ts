import { NextFunction, Request, Response } from 'express'

import { TimesServices } from '../services/TimesServices'

class TimesController {
	private timesServices: TimesServices
	constructor() {
		this.timesServices = new TimesServices()
	}
	async store(request: Request, reponse: Response, next: NextFunction) {
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
			return reponse.json(result)
		} catch (error) {
			next(error)
		}
	}
	async find(request: Request, reponse: Response, next: NextFunction){
    const {} = request.body

		try {
			const result = await this.timesServices.find()

			return reponse.json(result)
		} catch (error) {
			next(error)
		}

	}
	async findBySpecialties(request: Request, response: Response, next: NextFunction){
		const {specialties_id} = request.body
		console.log("specialties_id controller: ", specialties_id);


		try {
			const result = await this.timesServices.findBySpecialties(specialties_id)

			return response.json(result)

		} catch (error) {
			next(error)
		}
	}
	async delete(request: Request, response: Response, next: NextFunction){

			const {id} = request.params

			try {
				const result = await this.timesServices.delete(id)

				return response.json(result)

			} catch (error) {
				next(error)
			}
	}
}
export { TimesController }
