import { Router } from "express";
import { DoctorsController } from "../controllers/DoctorsController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

class DoctorsRoutes {
  private router: Router;
  private authMiddleware: AuthMiddleware;
  private doctorsController: DoctorsController;
  constructor() {
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.doctorsController = new DoctorsController();
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
		"/",
		this.authMiddleware.auth.bind(this.authMiddleware),
		this.doctorsController.store.bind(this.doctorsController)
	);

		/**
	 * @swagger
	 * /doctors:
	 *   get:
	 *     summary: Get all doctors
	 *     description: Retrieve a list of all registered doctors. Requires authentication.
	 *     tags:
	 *       - Doctors
	 *     parameters:
	 *       - in: header
	 *         name: Authorization
	 *         required: true
	 *         schema:
	 *           type: string
	 *           description: Bearer token for authentication (e.g., `Bearer {token}`)
	 *     responses:
	 *       200:
	 *         description: Successfully retrieved the list of doctors
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 type: object
	 *                 properties:
	 *                   id:
	 *                     type: string
	 *                   name:
	 *                     type: string
	 *                   crm:
	 *                     type: string
	 *                   specialty:
	 *                     type: string
	 *       401:
	 *         description: Unauthorized (token missing or invalid)
	 */
	this.router.get(
		"/",
		this.authMiddleware.auth.bind(this.authMiddleware),
		this.doctorsController.index.bind(this.doctorsController)
	);

	/**
	 * @swagger
	 * /doctors/{id}:
	 *   get:
	 *     summary: Get doctor by ID
	 *     description: Retrieve details of a specific doctor by their ID. Requires authentication.
	 *     tags:
	 *       - Doctors
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: ID of the doctor to retrieve
	 *       - in: header
	 *         name: Authorization
	 *         required: true
	 *         schema:
	 *           type: string
	 *           description: Bearer token for authentication (e.g., `Bearer {token}`)
	 *     responses:
	 *       200:
	 *         description: Successfully retrieved doctor details
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 id:
	 *                   type: string
	 *                 name:
	 *                   type: string
	 *                 crm:
	 *                   type: string
	 *                 specialty:
	 *                   type: string
	 *       401:
	 *         description: Unauthorized (token missing or invalid)
	 *       404:
	 *         description: Doctor doens't exists
	 */
	this.router.get(
		"/:id",
		this.authMiddleware.auth.bind(this.authMiddleware),
		this.doctorsController.findDoctorsById.bind(this.doctorsController)
	);

	/**
	 * @swagger
	 * /doctors/crm/{crm}:
	 *   get:
	 *     summary: Get doctor by CRM
	 *     description: Retrieve doctor details by CRM number. Requires authentication.
	 *     tags:
	 *       - Doctors
	 *     parameters:
	 *       - in: path
	 *         name: crm
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: CRM number of the doctor to retrieve
	 *       - in: header
	 *         name: Authorization
	 *         required: true
	 *         schema:
	 *           type: string
	 *           description: Bearer token for authentication (e.g., `Bearer {token}`)
	 *     responses:
	 *       200:
	 *         description: Successfully retrieved doctor details
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 id:
	 *                   type: string
	 *                 name:
	 *                   type: string
	 *                 crm:
	 *                   type: string
	 *                 specialty:
	 *                   type: string
	 *       401:
	 *         description: Unauthorized (token missing or invalid)
	 *       404:
	 *         description: Doctor doens't exists
	 */
	this.router.get(
		"/crm/:crm",
		this.authMiddleware.auth.bind(this.authMiddleware),
		this.doctorsController.findDoctorsByCrm.bind(this.doctorsController)
	);

	/**
	 * @swagger
	 * /doctors/{id}:
	 *   delete:
	 *     summary: Delete doctor by ID
	 *     description: Delete a doctor by their ID. Requires authentication.
	 *     tags:
	 *       - Doctors
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: ID of the doctor to delete
	 *       - in: header
	 *         name: Authorization
	 *         required: true
	 *         schema:
	 *           type: string
	 *           description: Bearer token for authentication (e.g., `Bearer {token}`)
	 *     responses:
	 *       204:
	 *         description: Doctor successfully deleted
	 *       401:
	 *         description: Unauthorized (token missing or invalid)
	 *       404:
	 *         description: Doctor doens't exists
	 */
	this.router.delete(
		"/:id",
		this.authMiddleware.auth.bind(this.authMiddleware),
		this.doctorsController.delete.bind(this.doctorsController)
	);
	return this.router;
 }
}
export { DoctorsRoutes };
