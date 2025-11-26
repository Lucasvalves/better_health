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

		/**
		* @swagger
		* /patients:
		*   get:
		*     summary: Get all patients
		*     description: Retrieves a list of all patients.
		*     tags:
		*       - Patients
		*     parameters:
		*       - in: header
		*         name: Authorization
		*         required: true
		*         schema:
		*           type: string
		*           description: Bearer token for authentication
		*     responses:
		*       200:
		*         description: A list of patients
		*       401:
		*         description: Unauthorized
		*/

		this.router.get(
			'/',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.patientsController.index.bind(this.patientsController)
		)

	/**
	 * @swagger
	 * /patients/{id}:
	 *   get:
	 *     summary: Get patient by ID
	 *     description: Retrieves a specific patient by their ID.
	 *     tags:
	 *       - Patients
	 *     parameters:
	 *       - in: header
	 *         name: Authorization
	 *         required: true
	 *         schema:
	 *           type: string
	 *           description: Bearer token for authentication
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: Patient ID
	 *     responses:
	 *       200:
	 *         description: Patient details
	 *       404:
	 *         description: Patient doens't exists
	 *
	 */
		this.router.get(
			'/:id',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.patientsController.findPatientsById.bind(this.patientsController)
		)

	 /**
	 * @swagger
	 * /patients/cpf/{cpf}:
	 *   get:
	 *     summary: Get patient by CPF
	 *     description: Retrieves a patient by their CPF.
	 *     tags:
	 *       - Patients
	 *     parameters:
	 *       - in: header
	 *         name: Authorization
	 *         required: true
	 *         schema:
	 *           type: string
	 *           description: Bearer token for authentication
	 *       - in: path
	 *         name: cpf
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: Patient CPF
	 *     responses:
	 *       200:
	 *         description: Patient details
	 *       404:
	 *         description: Patient doens't exists
	 */
		this.router.post(
			'/cpf/',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.patientsController.findPatientsByCpf.bind(this.patientsController)
		)

		/**
		* @swagger
		* /patients:
		*   put:
		*     summary: Update patient by ID
		*     description: Updates a patient's information.
		*     tags:
		*       - Patients
		*     parameters:
		*       - in: header
		*         name: Authorization
		*         required: true
		*         schema:
		*           type: string
		*           description: Bearer token for authentication
		*       - in: path
		*         name: id
		*         required: true
		*         schema:
		*           type: string
		*         description: Patient ID
		*     requestBody:
		*       required: true
		*       content:
		*         application/json:
		*           schema:
		*             type: object
		*             properties:
		*               name:
		*                 type: string
		*               cpf:
		*                 type: string
		*               phone:
		*                 type: string
		*             example:
		*               name: "João da Silva"
		*               cpf: "12345678901"
		*               phone: "(11) 98765-4321"
		*     responses:
		*       200:
		*         description: Patient updated successfully
		*       400:
		*         description: Invalid input
		*       404:
		*         description: Patient doens't exists
		*/
		this.router.put(
			'/:id',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.patientsController.update.bind(this.patientsController)
		)

	/**
	 * @swagger
	 * /patients/{id}:
		*   delete:
		*     summary: Delete patient by ID
		*     description: Deletes a patient record by their ID.
		*     tags:
		*       - Patients
		*     parameters:
		*       - in: header
		*         name: Authorization
		*         required: true
		*         schema:
		*           type: string
		*           description: Bearer token for authentication
		*       - in: path
		*         name: id
		*         required: true
		*         schema:
		*           type: string
		*         description: Patient ID
		*     responses:
		*       200:
		*         description: Patient deleted successfully
		*       404:
		*         description: Patient doens't exists
		*/
		this.router.delete(
			'/:id',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.patientsController.delete.bind(this.patientsController)
		)

		return this.router
	}
}
export { PatientsRoutes }
