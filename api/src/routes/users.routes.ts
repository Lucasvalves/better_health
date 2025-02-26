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
	 * /users:
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
	 *               password: "PauloA@19265"
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
/**
 * @swagger
 * /users:
 *   put:
 *     summary: Update user details
 *     description: Update a user's information, such as name, email, oldPassword, newPassword, and avatar_url. Requires authentication.
 *     tags:
 *       - User
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               avatar_url:
 *                 type: string
 *                 format: uri
 *                 description: URL to the user's avatar image
 *             example:
 *               name: "Paulo Almeida"
 *               email: "pauloalmeida@update.com"
 *               oldPassword: "oldPassword@19265"
 *               newPassword: "newPassword@19265"
 *               avatar_url: "https://example.com/images/paulo-avatar.jpg"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input or bad request
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized (token missing or invalid)
 */

		this.router.put(
			'/',
			upload.single('avatar_url'),
			this.authMiddleware.auth.bind(this.authMiddleware),
			this.usersController.update.bind(this.usersController)
		)
		/**
 * @swagger
 * /users/auth:
 *   post:
 *     summary: User authentication
 *     description: Authenticate user and generate an authentication token
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: body
 *         name: email
 *         schema:
 *           type: string
 *       - in: body
 *         name: password
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: "pauloalmeida@teste.com"
 *               password: "PauloA@19265"
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: "User or password invalid"
 */

		this.router.post(
			'/auth',
			this.usersController.auth.bind(this.usersController)
		)

		return this.router
	}
}
export { UsersRoutes }
