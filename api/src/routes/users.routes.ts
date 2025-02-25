import { Router } from 'express'
import { UsersController } from '../controllers/UsersController'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { upload } from '../config/multer'

class UsersRoutes {
	private router: Router
	private usersController: UsersController
	private authMiddleware: AuthMiddleware

	constructor() {
		this.router = Router()
		this.usersController = new UsersController()
		this.authMiddleware = new AuthMiddleware()
	}

	getRoutes(): Router {

	/**
	 * @swagger
	 * /user:
	 *   post:
	 *     summary: Create user
	 *     description: Create user
	 *     tags:
	 *      - User
	 *     parameters:
	 *       - in: body
	 *         name: name
	 *         schema:
	 *          type: string
	 *       - in: body
	 *         name: email
	 *         schema:
	 *          type: string
	 *       - in: body
	 *         name: password
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
	 *             example:         # Sample object
	 *               name: "Paulo Almeida"
	 *               email: "pauloalmeida@teste.com"
	 *               password: "PauloA@1965"
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
	 *            email
	 *             type:string
	 *            password
	 *             type:string
	 *       400:
	 *         description: "Bad Request"
	 */

		this.router.post(
			'/',
			this.usersController.store.bind(this.usersController)
		)
		this.router.put(
			'/',
			upload.single('avatar_url'),
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.usersController.update.bind(this.usersController)
		)
		this.router.post(
			'/auth',
			this.usersController.auth.bind(this.usersController)
		)

		return this.router
	}
}
export { UsersRoutes }
