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
					/**
	 * @swagger
	 * /doctors:
	 *   post:
	 *     summary: Create doctors
	 *     description: Create doctors
	 *     tags:
	 *      - Doctors
	 *     parameters:
	 *       - in: body
	 *         name: name
	 *         schema:
	 *          type: string
	 *       - in: body
	 *         name: cpf
	 *         schema:
	 *          type: string
	 *       - in: body
	 *         name: phone
	 *         schema:
	 *          type: string
	 *     requestBody:
	 *       content:
	 *         application/json:    # Request body contents
	 *           schema:
	 *             type: object
	 *             properties:
	 *               name:
	 *                 type: string
	 *               crm:
	 *                 type: string
	 *               specialties_id:
	 *                 type: string
	 *             example:
	 *               name: "Luana Silva"
	 *               crm: "9098"
	 *               specialties_id: "5"
	 *     responses:
	 *       201:
	 *         description: OK
	 *         content:
	 *          aplication/json:
	 *           schema:
	 *           type: object
	 *           properties:
	 *            id
	 *             type:string
	 *            name
	 *             type:string
	 *            crm
	 *             type:string
	 *            specialties_id
	 *             type:string
	 *       400:
	 *         description: "Bad Request"
	 *       401:
	 *         description: "Unauthorized"
	 */

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
