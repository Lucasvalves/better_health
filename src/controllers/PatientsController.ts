import { NextFunction, Request, Response, json } from 'express'
import { PatientsServices } from '../services/PatientsServices'

class PatientsController {
	private patientsServices: PatientsServices
	constructor() {
		this.patientsServices = new PatientsServices()
	}
	async store(request: Request, response: Response, next: NextFunction) {
		const { name, cpf } = request.body
		const { user_id } = request

		try {
			const result = await this.patientsServices.create({ name, cpf, user_id })
			return response.status(201).json(result)
		} catch (error) {
			next(error)
		}
	}

	async index(request: Request, response: Response, next: NextFunction) {
		const { user_id } = request

		try {
			const result = await this.patientsServices.index(user_id)
			return response.json(result)
		} catch (error) {
			next(error)
		}
	}
	async findPatientsById(
		request: Request,
		response: Response,
		next: NextFunction
	) {
		const { id } = request.params

		try {
			const patient = await this.patientsServices.findPatientsById(id)
			return response.json(patient)
		} catch (error) {
			next(error)
		}
	}
	async findPatientsByCpf(
		request: Request,
		response: Response,
		next: NextFunction
	) {

		const { cpf } = request.params

		try {
			const patient = await this.patientsServices.findPatientsByCpf(cpf)
			return response.json(patient)
		} catch (error) {
			next(error)
		}
	}
}

export { PatientsController }
