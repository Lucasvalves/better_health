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

	/**
	 * @swagger
	 * /appointments:
	 *   post:
	 *     summary: Create a new appointment
	 *     description: Schedule a new appointment in the system.
	 *     tags:
	 *       - Appointments
	 *     parameters:
	 *       - in: header
	 *         name: Authorization
	 *         required: true
	 *         schema:
	 *           type: string
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               patients_id:
	 *                 type: string
	 *                 example: 1ee07f6-b176-4984-9da0-a51541a90171
	 *               specialties_id:
	 *                 type: string
	 *                 example: 02d6b88f-8c1d-4da5-b4ac-1945d5b9c3c6
	 *               doctors_id:
	 *                 type: string
	 *                 example: 6b4423bb-c816-4dd6-92f5-3a770bd7dea3
	 *               date:
	 *                 type: string
	 *                 format: date-time
	 *                 example: 2024-02-01T10:00:00.123Z
	 *     responses:
	 *       201:
	 *         description: Appointment created successfully
	 *       400:
	 *         description: Invalid input data
	 *       401:
	 *         description: Unauthorized
	 */
		this.router.post(
			'/',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.appointmentsController.store.bind(this.appointmentsController)
		),

	/**
	 * @swagger
	 * /appointments/filter:
	 *   get:
	 *     summary: Retrieve filtered appointments
	 *     description: Get a list of appointments filtered by date range and specialty.
	 *     tags:
	 *       - Appointments
	 *     parameters:
	 *       - in: header
	 *         name: Authorization
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - in: body
	 *         name: filter
	 *         required: true
	 *         schema:
	 *           type: object
	 *           properties:
	 *             range:
	 *               type: object
	 *               properties:
	 *                 startDate:
	 *                   type: string
	 *                   format: date
	 *                   example: 2024-02-01T01:00:00.123Z
	 *                 endDate:
	 *                   type: string
	 *                   format: date
	 *                   example: 2024-02-28T00:00:00.123Z
	 *             specialties_id:
	 *               type: string
	 *               example: 02d6b88f-8c1d-4da5-b4ac-1945d5b9c3c6
	 *     responses:
	 *       200:
	 *         description: List of filtered appointments
	 *       400:
	 *         description: Invalid filter parameters
	 *       401:
	 *         description: Unauthorized
	 */
		this.router.get(
			'/filter',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.appointmentsController.index.bind(this.appointmentsController)
		)

	/**
	 * @swagger
	 * /appointments/available-days:
	 *   post:
	 *     summary: Get available days for a specialty
	 *     description: Retrieve available days for scheduling based on the specialty and date.
	 *     tags:
	 *       - Appointments
	 *     parameters:
	 *       - in: header
	 *         name: Authorization
	 *         required: true
	 *         schema:
	 *           type: string
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               date:
	 *                 type: string
	 *                 format: date
	 *                 example: 2024-02-01T12:00:00.123Z
	 *               specialties_id:
	 *                 type: string
	 *                 example: 02d6b88f-8c1d-4da5-b4ac-1945d5b9c3c6
	 *     responses:
	 *       200:
	 *         description: Available days for the given specialty
	 *       400:
	 *         description: Invalid input data
	 *       401:
	 *         description: Unauthorized
	 */
		this.router.post(
			'/available-days',
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.appointmentsController.availableDays.bind(this.appointmentsController)
		)

		return this.router
	}
}
export { AppointmentsRoutes }

