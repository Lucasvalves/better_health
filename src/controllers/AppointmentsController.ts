import { Request, Response, NextFunction } from 'express'

import { TimesServices } from '../services/TimesServices'
import { AppointmentsServices } from '../services/AppointmentsServices'

class AppointmentsController {
	private appointmentsServices: AppointmentsServices
	constructor() {
		this.appointmentsServices = new AppointmentsServices()
	}
	// store(request: Request, response: Response, next: NextFunction) {
	// 	const { id, date, doctors_id} = request.body

	// 	const { user_id } = request

	// 		try {

	// 		} catch (error) {
	// 			next(error)
	// 		}
	// }
	async availableDays(
		request: Request,
		response: Response,
		next: NextFunction
	) {
		const { date, specialties_id } = request.body
		const {user_id} = request.params

		try {
			const result = await this.appointmentsServices.availableDays({date, specialties_id, user_id})

			return response.json(result)
		} catch (error) {
			next(error)
		}


		// try {
		// 	const result = await this.appointmentsService.availableDays({ date, specialties_id, user_id})
		// 	return response.json(result)

		// } catch (error) {
		// 	next(error)
		// }
	}
}
export { AppointmentsController }
