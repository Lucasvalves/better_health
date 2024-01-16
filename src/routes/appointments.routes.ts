import { Router } from 'express'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { AppointmentsController } from '../controllers/AppointmentsController'

class AppointmentsRoutes {
	private router: Router
	private authMiddleware: AuthMiddleware
	private appointmentsController: AppointmentsController

	constructor() {
		this.router = Router()
		this.authMiddleware = new AuthMiddleware()
		this.appointmentsController = new AppointmentsController()
	}

	getRoutes(): Router {
		this.router.post(
			'/',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.appointmentsController.store.bind(this.appointmentsController)
		)

		return this.router
	}
}
export { AppointmentsRoutes }
