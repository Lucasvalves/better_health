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
			/**
	 * @swagger
	 * /patients:
	 *   post:
	 *     summary: Create patients
	 *     description: Create patients
	 *     tags:
	 *      - Patients
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
	 *               email:
	 *                 type: string
	 *               password:
	 *                 type: string
	 *             example:
	 *               name: "Luana Silva"
	 *               cpf: "06861740537"
	 *               phone: "7197579988"
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
	 *            cpf
	 *             type:string
	 *            phone
	 *             type:string
	 *       400:
	 *         description: "Bad Request"
	 *       401:
	 *         description: "Unauthorized"
	 */

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
		this.router.put(
			'/:id',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.patientsController.update.bind(this.patientsController)
		)
		this.router.delete(
			'/:id',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.patientsController.delete.bind(this.patientsController)
		)

		return this.router
	}
}
export { PatientsRoutes }
