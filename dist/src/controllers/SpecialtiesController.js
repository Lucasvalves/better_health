"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialtiesController = void 0;
const SpecialtiesServices_1 = require("../services/SpecialtiesServices");
class SpecialtiesController {
    constructor() {
        this.specialtiesServices = new SpecialtiesServices_1.SpecialtiesServices();
    }
    async store(request, response, next) {
        //criar usuario
        const { name } = request.body;
        try {
            const result = await this.specialtiesServices.create(name);
            response.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async index(request, response, next) {
        try {
            const result = await this.specialtiesServices.index();
            response.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async findSpecialty(request, response, next) {
        const { id } = request.params;
        try {
            const result = await this.specialtiesServices.findSpecialty(id);
            response.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SpecialtiesController = SpecialtiesController;
