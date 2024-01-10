import { NextFunction, Request, Response, json } from 'express'
import { PatientsServices } from '../services/PatientsServices'

class PatientsController {
	private patientsServices: PatientsServices
	constructor() {
		this.patientsServices = new PatientsServices()
	}
	async store(request: Request, response: Response, next: NextFunction) {
		const { name, cpf } = request.body
		const {user_id} =  request

		try {
			const result = await this.patientsServices.create({ name, cpf, user_id})
			return response.status(201).json(result)
		} catch (error) {
			next(error)
		}
	}
}

export { PatientsController }
