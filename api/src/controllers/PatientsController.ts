import { NextFunction, Request, Response } from 'express'
import { PatientsServices } from '../services/PatientsServices'

class PatientsController {
	private patientsServices: PatientsServices
	constructor() {
		this.patientsServices = new PatientsServices()
	}
	async store(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const { name, cpf, phone } = request.body
		const { user_id } = request

		try {
			const result = await this.patientsServices.create({
				name,
				cpf,
				user_id,
				phone,
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
		try {
			const result = await this.patientsServices.index()
			response.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}
	async findPatientsById(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const { id } = request.params

		try {
			const patient = await this.patientsServices.findPatientsById(id)
			response.status(200).json(patient)
		} catch (error) {
			next(error)
		}
	}
	async findPatientsByCpf(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const { cpf } = request.body

		try {
			const patient = await this.patientsServices.findPatientsByCpf(cpf)
			response.status(200).json(patient)
		} catch (error) {
			next(error)
		}
	}
	async update(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const { name, cpf, phone } = request.body
		const { id } = request.params

		try {
			const result = await this.patientsServices.update({
				id,
				name,
				cpf,
				phone,
			})

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
			const result = await this.patientsServices.delete(id)

			response.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}
}

export { PatientsController }
