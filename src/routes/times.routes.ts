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

	/**
	 * @swagger
	 * /times:
	 *   post:
	 *     summary: Create a new time entry
	 *     description: Store a new time entry with specific days, hours, and associations
	 *     tags:
	 *       - Times
	 *     parameters:
	 *       - in: header
	 *         name: Authorization
	 *         required: true
	 *         schema:
	 *           type: string
	 *           description: Bearer token for authentication (e.g., `Bearer {token}`)
	 *     requestBody:
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               days:
	 *                 type: array
	 *                 items:
	 *                   type: string
	 *               startHour:
	 *                 type: string
	 *               endHour:
	 *                 type: string
	 *               specialties_id:
	 *                 type: string
	 *               doctors_id:
	 *                 type: string
	 *             example:
	 *               days: [1, 2]
	 *               startHour: "2024-11-01T00:00:00.123Z"
	 *               endHour: "2024-11-30T01:00:00.123Z"
	 *               specialties_id: "831dda49-a740-4389-b0ef-55345193c503"
	 *               doctors_id: "e1de6386-6286-4d3b-aea2-5e461fa899b4"
	 *     responses:
	 *       201:
	 *         description: Time entry created successfully
	 *       400:
	 *         description: Bad request
	 */
	this.router.post(
		'/',
		this.authMiddleware.auth.bind(this.authMiddleware),
		this.timesController.store.bind(this.timesController)
	)

	/**
	 * @swagger
	 * /times:
	 *   get:
	 *     summary: Retrieve all time entries
	 *     description: Get a list of all stored time entries
	 *     tags:
	 *       - Times
	 *     parameters:
	 *       - in: header
	 *         name: Authorization
	 *         required: true
	 *         schema:
	 *           type: string
	 *     responses:
	 *       200:
	 *         description: List of time entries
	 *       401:
	 *         description: Unauthorized
	 */
	this.router.get(
		'/',
		this.authMiddleware.auth.bind(this.authMiddleware),
		this.timesController.find.bind(this.timesController)
	)

	/**
	 * @swagger
	 * /times/specialties:
	 *   get:
	 *     summary: Retrieve times by specialties
	 *     description: Get a list of time entries filtered by specialty
	 *     tags:
	 *       - Times
	 *     parameters:
	 *       - in: header
	 *         name: Authorization
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - in: query
	 *         name: specialties_id
	 *         required: true
	 *         schema:
	 *           type: string
	 *     responses:
	 *       200:
	 *         description: List of time entries for the given specialty
	 *       400:
	 *         description: Bad request
	 */
	this.router.get(
		'/specialties',
		this.authMiddleware.auth.bind(this.authMiddleware),
		this.timesController.findBySpecialties.bind(this.timesController)
	)

	/**
	 * @swagger
	 * /times/{id}:
	 *   delete:
	 *     summary: Delete a time entry
	 *     description: Delete a time entry by its unique identifier
	 *     tags:
	 *       - Times
	 *     parameters:
	 *       - in: header
	 *         name: Authorization
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *     responses:
	 *       200:
	 *         description: Time entry deleted successfully
	 *       404:
	 *         description: Time entry not found
	 */
	this.router.delete(
		'/:id',
		this.authMiddleware.auth.bind(this.authMiddleware),
		this.timesController.delete.bind(this.timesController)
	)

		return this.router
	}
}

export { TimesRoutes }
