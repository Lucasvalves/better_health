import { Router } from 'express'
import { PatientsController } from '../controllers/PatientsController'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'

class PatientsRoutes {
	private router: Router
	private patientsController: PatientsController
	private authMiddleware : AuthMiddleware

	constructor() {
		this.router = Router()
		this.patientsController = new PatientsController()
		this.authMiddleware = new AuthMiddleware()
	}
	getRoutes(): Router {
		this.router.post('/',
		this.authMiddleware.auth.bind(this.authMiddleware),
		this.patientsController.store.bind(this.patientsController))

		return this.router
	}
}
export { PatientsRoutes }
