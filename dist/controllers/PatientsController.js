"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientsController = void 0;
const PatientsServices_1 = require("../services/PatientsServices");
class PatientsController {
    constructor() {
        this.patientsServices = new PatientsServices_1.PatientsServices();
    }
    async store(request, response, next) {
        const { name, cpf, phone } = request.body;
        const { user_id } = request;
        try {
            const result = await this.patientsServices.create({
                name,
                cpf,
                user_id,
                phone,
            });
            response.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async index(request, response, next) {
        try {
            const result = await this.patientsServices.index();
            response.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async findPatientsById(request, response, next) {
        const { id } = request.params;
        try {
            const patient = await this.patientsServices.findPatientsById(id);
            response.status(200).json(patient);
        }
        catch (error) {
            next(error);
        }
    }
    async findPatientsByCpf(request, response, next) {
        const { cpf } = request.params;
        try {
            const patient = await this.patientsServices.findPatientsByCpf(cpf);
            response.status(200).json(patient);
        }
        catch (error) {
            next(error);
        }
    }
    async update(request, response, next) {
        const { name, cpf, phone } = request.body;
        const { id } = request.params;
        try {
            const result = await this.patientsServices.update({ id, name, cpf, phone });
            response.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(request, response, next) {
        const { id } = request.params;
        try {
            const result = await this.patientsServices.delete(id);
            response.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PatientsController = PatientsController;
