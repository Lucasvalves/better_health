import { NextFunction, Request, Response } from 'express'
import { SpecialtiesServices } from '../services/SpecialtiesServices'

class SpecialtiesController {
	private specialtiesServices: SpecialtiesServices
	constructor() {
		this.specialtiesServices = new SpecialtiesServices()
	}

	async store(request: Request, response: Response, next: NextFunction): Promise<void> {
		//criar usuario
		const { name } = request.body

		try {
			const result = await this.specialtiesServices.create(name)
			response.status(201).json(result)
		} catch (error) {
			next(error)
		}
	}
	async index(request: Request, response: Response, next: NextFunction) : Promise<void> {
		try {
			const result = await this.specialtiesServices.index()
			response.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}
	async findSpecialty(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void>  {
		const { id } = request.params

		try {
			const result = await this.specialtiesServices.findSpecialty(id)
			response.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}

	// async update(request: Request, response: Response, next: NextFunction) {
	// 	const { name, oldPasswork, newPassword } = request.body
	// 	const { user_id } = request
	// 	try {
	// 		const result = await this.usersServices.update({
	// 			name,
	// 			oldPasswork,
	// 			newPassword,
	// 			user_id,
	// 		})
	// 		return response.status(200).json(result)
	// 	} catch (error) {
	// 		next(error)
	// 	}
	//}
}
export { SpecialtiesController }
