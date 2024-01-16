import { Request, Response, NextFunction } from 'express'

class AppointmentsController {
	constructor() {}
	store(request: Request, response: Response, next: NextFunction) {
		const { id, date, patients_id, doctors_id, users_id } =
			request.body

			try {
				

			} catch (error) {
				next(error)
			}
	}
}
export { AppointmentsController }
