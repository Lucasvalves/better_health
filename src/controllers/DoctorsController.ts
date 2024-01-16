import { NextFunction, Request, Response } from 'express'
import { DoctorsServices } from '../services/DoctorsServices'

class DoctorsController {
	private doctorsServices : DoctorsServices

	constructor(){
		this.doctorsServices = new DoctorsServices()
	}
	async store(request: Request, response: Response, next: NextFunction) {
		const { name, crm, specialties } = request.body
		const {user_id} = request
		console.log(user_id);


		try {
		const result = await this.doctorsServices.create({ name, crm, specialties, user_id })

		return response.status(201).json(result)

		} catch (error) {
			next(error)
		}
	}
}
export { DoctorsController }
