import { NextFunction, Request, Response } from 'express'
import { DoctorsServices } from '../services/DoctorsServices'

class DoctorsController {
	private doctorsServices: DoctorsServices

	constructor() {
		this.doctorsServices = new DoctorsServices()
	}
	async store(request: Request, response: Response, next: NextFunction) {
		const { name, crm, specialties_id } = request.body
		const { user_id } = request

		try {
			const result = await this.doctorsServices.create({
				name,
				crm,
				specialties_id,
				user_id,
			})

			return response.status(201).json(result)
		} catch (error) {
			next(error)
		}
	}

	async index(request: Request, response: Response, next: NextFunction) {
		const { user_id } = request

		try {
			const result = await this.doctorsServices.index(user_id)

			return response.status(201).json(result)
		} catch (error) {
			next(error)
		}
	}
	async findDoctorsById(
		request: Request,
		response: Response,
		next: NextFunction
	) {
		const { id } = request.params
		console.log(id);


		try {
			const result = await this.doctorsServices.findDoctorsById(id)
			return response.json(result)
		} catch (error) {
			next(error)
		}
	}
	async findDoctorsByCrm(
		request: Request,
		response: Response,
		next: NextFunction
	) {
		const { crm } = request.params

		try {
			const result = await this.doctorsServices.findDoctorsByCrm(crm)
			return response.json(result)
		} catch (error) {
			next(error)
		}
	}
	async delete(request: Request, response: Response, next: NextFunction) {
		const { id } = request.params

		try {
			const result = await this.doctorsServices.delete(id)

			return response.json(result)
		} catch (error) {
			next(error)
		}
	}
}
export { DoctorsController }
