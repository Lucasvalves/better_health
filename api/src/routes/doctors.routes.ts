import { Router } from 'express'
import { DoctorsController } from '../controllers/DoctorsController'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'

class DoctorsRoutes {
	private router: Router
	private authMiddleware: AuthMiddleware
	private doctorsController: DoctorsController
	constructor() {
		this.router = Router()
		this.authMiddleware = new AuthMiddleware()
		this.doctorsController = new DoctorsController()
	}

	getRoutes(): Router {
		this.router.post(
			'/',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.doctorsController.store.bind(this.doctorsController)
		)
		this.router.get(
			'/',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.doctorsController.index.bind(this.doctorsController)
		)
		this.router.get(
			'/:id',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.doctorsController.findDoctorsById.bind(this.doctorsController)
		)
		this.router.get(
			'/crm/:crm',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.doctorsController.findDoctorsByCrm.bind(this.doctorsController)
		)
		this.router.delete(
			'/:id',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.doctorsController.delete.bind(this.doctorsController)
		)
		return this.router
	}
}
export { DoctorsRoutes }
