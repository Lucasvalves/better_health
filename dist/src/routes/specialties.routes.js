"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialtiesRoutes = void 0;
const express_1 = require("express");
const SpecialtiesController_1 = require("../controllers/SpecialtiesController");
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
class SpecialtiesRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.specialtiesController = new SpecialtiesController_1.SpecialtiesController();
        this.authMiddleware = new AuthMiddleware_1.AuthMiddleware();
    }
    getRoutes() {
        /**
     * @swagger
     * /specialties:
     *   post:
     *     summary: Create a new specialty
     *     description: Store a new specialty in the database.
     *     tags:
     *       - Specialties
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
     *               name:
     *                 type: string
     *                 example: Cardiologista
     *               duration:
     *                 type: string
     *                 format: date-time
     *                 example: 2029-02-01T00:30:00.000Z
     *     responses:
     *       201:
     *         description: Specialty created successfully
     *       400:
     *         description: Invalid input data
     *       401:
     *         description: Unauthorized
     */
        this.router.post('/', this.authMiddleware.auth.bind(this.authMiddleware), this.specialtiesController.store.bind(this.specialtiesController));
        /**
         * @swagger
         * /specialties:
         *   get:
         *     summary: Retrieve all specialties
         *     description: Get a list of all stored specialties.
         *     tags:
         *       - Specialties
         *     parameters:
         *       - in: header
         *         name: Authorization
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: List of specialties
         *       401:
         *         description: Unauthorized
         */
        this.router.get('/', this.authMiddleware.auth.bind(this.authMiddleware), this.specialtiesController.index.bind(this.specialtiesController));
        /**
         * @swagger
         * /specialties/{id}:
         *   get:
         *     summary: Retrieve a specific specialty
         *     description: Get details of a specific specialty by its ID.
         *     tags:
         *       - Specialties
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
         *         description: The specialty ID
         *     responses:
         *       200:
         *         description: Specialty details
         *       404:
         *         description: Specialty not found
         *       401:
         *         description: Unauthorized
         */
        this.router.get('/:id', this.authMiddleware.auth.bind(this.authMiddleware), this.specialtiesController.findSpecialty.bind(this.specialtiesController));
        return this.router;
    }
}
exports.SpecialtiesRoutes = SpecialtiesRoutes;
