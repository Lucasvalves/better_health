import { Router } from 'express'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { TimesController } from '../controllers/TimesController'

class TimesRoutes {
	private router: Router
	private authMiddleware: AuthMiddleware
	private timesController: TimesController

	constructor() {
		this.router = Router()
		this.authMiddleware = new AuthMiddleware()
		this.timesController = new TimesController()
	}

	getRoutes(): Router {
		this.router.post(
			'/',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.timesController.store.bind(this.timesController)
		)
		this.router.get(
			'/',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.timesController.find.bind(this.timesController)
		)
		this.router.delete(
			'/:id',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.timesController.delete.bind(this.timesController)
		)
		this.router.get(
			'/specialties',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.timesController.findBySpecialties.bind(this.timesController)
		)
		return this.router
	}
}
export { TimesRoutes }
