import { Router } from 'express'
import { SpecialtiesController } from '../controllers/SpecialtiesController'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'

class SpecialtiesRoutes {
	private router: Router
	private specialtiesController: SpecialtiesController
	private authMiddleware: AuthMiddleware

	constructor() {
		this.router = Router()
		this.specialtiesController = new SpecialtiesController()
		this.authMiddleware = new AuthMiddleware()
	}

	getRoutes(): Router {
		this.router.post(
			'/',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.specialtiesController.store.bind(this.specialtiesController)
		)
		this.router.get(
			'/',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.specialtiesController.index.bind(this.specialtiesController)
		)
		this.router.get(
			'/:id',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.specialtiesController.findSpecialty.bind(this.specialtiesController)
		)


		return this.router
	}
}
export { SpecialtiesRoutes }
