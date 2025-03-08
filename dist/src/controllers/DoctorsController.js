"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorsController = void 0;
const DoctorsServices_1 = require("../services/DoctorsServices");
class DoctorsController {
    constructor() {
        this.doctorsServices = new DoctorsServices_1.DoctorsServices();
    }
    async store(request, response, next) {
        const { name, crm, specialties_id } = request.body;
        const { user_id } = request;
        try {
            const result = await this.doctorsServices.create({
                name,
                crm,
                specialties_id,
                user_id,
            });
            response.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async index(request, response, next) {
        const { user_id } = request;
        try {
            const result = await this.doctorsServices.index(user_id);
            response.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async findDoctorsById(request, response, next) {
        const { id } = request.params;
        console.log(id);
        try {
            const result = await this.doctorsServices.findDoctorsById(id);
            response.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async findDoctorsByCrm(request, response, next) {
        const { crm } = request.params;
        try {
            const result = await this.doctorsServices.findDoctorsByCrm(crm);
            response.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(request, response, next) {
        const { id } = request.params;
        try {
            const result = await this.doctorsServices.delete(id);
            response.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DoctorsController = DoctorsController;
