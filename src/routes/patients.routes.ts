import { Router } from 'express'
import { PatientsController } from '../controllers/PatientsController'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'

class PatientsRoutes {
	private router: Router
	private patientsController: PatientsController
	private authMiddleware: AuthMiddleware

	constructor() {
		this.router = Router()
		this.patientsController = new PatientsController()
		this.authMiddleware = new AuthMiddleware()
	}
	getRoutes(): Router {
		this.router.post(
			'/',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.patientsController.store.bind(this.patientsController)
		)

		this.router.get(
			'/',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.patientsController.index.bind(this.patientsController)
		)

		this.router.get(
			'/:id',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.patientsController.findPatientsById.bind(this.patientsController)
		)
		this.router.get(
			'/cpf/:cpf',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.patientsController.findPatientsByCpf.bind(this.patientsController)
		)

		return this.router
	}
}
export { PatientsRoutes }
